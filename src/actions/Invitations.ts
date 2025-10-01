"use server"

import { auth } from "@/lib/auth";
import { db } from "@/lib/db"
import { templates, templateVariables, contacts } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { headers } from "next/headers";

async function getUserIdFromSession() {
    const session = await auth.api.getSession({ headers: new Headers(await headers()) });
    if (!session) throw new Error("Unauthorized");
    return session.user.id;
}


export async function getInvitations() {
    const userId = await getUserIdFromSession()

    // Ambil template pertama user
    const templateRows = await db
        .select()
        .from(templates)
        .where(eq(templates.userId, userId))
        .limit(1)

    const template = templateRows[0]

    if (!template) return null

    // Ambil semua variable milik template tsb
    const variableRows = await db
        .select()
        .from(templateVariables)
        .where(eq(templateVariables.templateId, template.id))

    // Ambil semua kontak milik user
    const contactRows = await db
        .select()
        .from(contacts)
        .where(eq(contacts.userId, userId))
        .orderBy(desc(contacts.createdAt))

    return {
        templates: {
            content: template.content,
            variables: variableRows.map(v => ({
                key: v.key,
                value: v.value
            }))
        },
        contacts: contactRows.map(c => ({
            id: c.id,
            name: c.name,
            phone: c.phone,
            isInvited: c.isInvited
        }))
    }
}
