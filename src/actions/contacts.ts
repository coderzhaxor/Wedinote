"use server";

import type { InferSelectModel } from "drizzle-orm";
import { and, eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";

export type Contact = InferSelectModel<typeof contacts>;

/** Get userId from session */
export async function getUserIdFromSession() {
  const session = await auth.api.getSession({ headers: new Headers(await headers()) });
  if (!session) throw new Error("Unauthorized");
  return session.user.id;
}

/** Get all contacts by user */
export async function getContacts() {
  const userId = await getUserIdFromSession();
  return db
    .select()
    .from(contacts)
    .where(eq(contacts.userId, userId))
    .orderBy(desc(contacts.createdAt));
}

/** Add contacts (batch insert with conflict ignore) */
export async function addContacts(contactList: { name: string; phone?: string | null }[]) {
  const userId = await getUserIdFromSession();

  const contactsToInsert = contactList
    .filter((c) => c.name?.trim() || (c.phone && c.phone !== "+628xxxxxxxxx"))
    .map((c) => ({
      userId,
      name: c.name,
      ...(c.phone && c.phone !== "+628xxxxxxxxx" ? { phone: c.phone } : {}),
    }));

  if (!contactsToInsert.length) {
    return { inserted: [], all: await getContacts() };
  }

  const inserted = await db
    .insert(contacts)
    .values(contactsToInsert)
    .onConflictDoNothing({ target: [contacts.userId, contacts.phone] })
    .returning();

  return { inserted, all: await getContacts() };
}

/** Delete single contact */
export async function deleteContact(contactId: number) {
  const userId = await getUserIdFromSession();
  await db
    .delete(contacts)
    .where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)));

  return getContacts();
}

/** Delete all contacts */
export async function deleteAllContacts() {
  const userId = await getUserIdFromSession();
  await db.delete(contacts).where(eq(contacts.userId, userId));
  return getContacts();
}

/** Update contact */
export async function updateContact(contactId: number, data: { name: string; phone?: string | null }) {
  const userId = await getUserIdFromSession();
  await db
    .update(contacts)
    .set(data)
    .where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)));

  return getContacts();
}
