"use server";

import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { contacts } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type ContactProps = {
  name: string;
  phone: string;
};

// ambil userId dari session
export async function getUserIdFromSession() {
  const rawHeaders = await headers();
  const heads = new Headers(rawHeaders);
  const session = await auth.api.getSession({ headers: heads });
  if (!session) throw new Error("Unauthorized");
  return session.user.id;
}

// ambil semua kontak milik user
export async function getContacts() {
  const userId = await getUserIdFromSession();

  return await db
    .select()
    .from(contacts)
    .where(eq(contacts.userId, userId))
    .orderBy(contacts.createdAt);
}

export async function addContacts(contactList: ContactProps[]) {
  const userId = await getUserIdFromSession();

  const contactsToInsert = contactList
    .filter(c => c.name?.trim() !== "" || (c.phone && c.phone !== "+628xxxxxxxxx"))
    .map((c) => {
      const base = { userId, name: c.name };
      if (c.phone && c.phone !== "+628xxxxxxxxx") {
        return { ...base, phone: c.phone };
      }
      return base; // tidak sertakan phone
    });

  if (contactsToInsert.length === 0) return getContacts(); // tidak ada data valid

  // insert batch dengan onConflictDoNothing
  await db
    .insert(contacts)
    .values(contactsToInsert)
    .onConflictDoNothing({
      target: [contacts.userId, contacts.phone],
    });

  return getContacts();
}

export async function deleteContact(contactId: number) {
  const userId = await getUserIdFromSession();
  await db.delete(contacts).where(and(
    eq(contacts.id, contactId),
    eq(contacts.userId, userId)
  ));
  return getContacts();
}