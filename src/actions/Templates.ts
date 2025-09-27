"use server"

import { db } from "@/lib/db";
import { templates, templateVariables } from "@/lib/db/schema";
import type { TemplateProps, VariableProps } from "@/types/templates";
import { getUserIdFromSession } from "./contacts";
import { desc, eq, sql } from "drizzle-orm";

export const getTemplates = async () => {
  const userId = await getUserIdFromSession();
  return db
    .select()
    .from(templates)
    .where(eq(templates.userId, userId))
    .orderBy(desc(templates.createdAt));
};

export const getTemplateId = async () => {
  const userId = await getUserIdFromSession();
  const template = await db
    .select({
      templateId: templates.id
    })
    .from(templates)
    .where(eq(templates.userId, userId))
    .limit(1)

  return template.at(0)?.templateId ?? null;
}

export const getTemplateVariables = async () => {
  const templateId = await getTemplateId();
  if (templateId === null) {
    return [];
  }
  return db
    .select()
    .from(templateVariables)
    .where(eq(templateVariables.templateId, templateId));
};

export const saveTemplate = async ({ content }: TemplateProps) => {
  const userId = await getUserIdFromSession();
  return await db
    .insert(templates)
    .values({
      userId,
      content,
    })
    .onConflictDoUpdate({
      target: templates.userId,
      set: {
        content,
      }
    })
    .returning({ templateId: templates.id });
};

export const saveVariables = async (variables: VariableProps[]) => {
  const userId = await getUserIdFromSession();
  let templateId: number | null = await getTemplateId();

  // Insert empty template first if the user doesn't have any template
  if (templateId === null) {
    const inserted = await db
      .insert(templates)
      .values({
        userId,
        content: "",
      })
      .returning({ templateId: templates.id });
    templateId = inserted[0].templateId;
  }

  // Save the variables to the database or perform any necessary actions
  return await db
    .insert(templateVariables)
    .values(
      variables.map((variable) => ({
        ...variable,
        userId,
        templateId,
      })),
    )
    .onConflictDoUpdate({
      target: [templateVariables.templateId, templateVariables.key],
      set: {
        value: sql`EXCLUDED.value`,
      },
    })
    .returning();
};
