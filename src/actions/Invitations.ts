"use server"

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import { contacts, invitations, templates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getUserIdFromSession() {
    const session = await auth.api.getSession({ headers: new Headers(await headers()) });
    if (!session) throw new Error("Unauthorized");
    return session.user.id;
}

export async function getInvitations() {
    const userId = await getUserIdFromSession()
    /*
        [
            {templates: {
                content: "",
                variables: [
                    {},
                    {},
                    {},
                ]
            }},
            contacts: [
                {id: "", name: "", phone: ""},
                {id: "", name: "", phone: ""},
                {id: "", name: "", phone: ""},
            ]
        ]
    */
    // Ambil template milik user (jika ada)
    const [templateRow, invitedContacts] = await Promise.all([
        db.query.templates.findFirst({
            where: eq(templates.userId, userId),
            with: { variables: true },
        }),
        db
            .select({
                id: contacts.id,
                name: contacts.name,
                phone: contacts.phone,
                isInvited: invitations.isInvited
            })
            .from(invitations)
            .innerJoin(contacts, eq(invitations.contactId, contacts.id))
            .where(eq(invitations.userId, userId)),
    ]);

    const template = templateRow
        ? {
            content: templateRow.content,
            variables: templateRow.variables.map(v => ({ key: v.key, value: v.value })),
        }
        : null;

    // Format return sesuai permintaan
    return {
        template,
        contacts: invitedContacts
    }

}