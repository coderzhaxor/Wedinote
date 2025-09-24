"use server"

import { db } from "@/lib/db";
import { templates, templateVariables } from "@/lib/db/schema";
import type { TemplateProps, VariableProps } from "@/types/templates";
import { getUserIdFromSession } from "./contacts";
import { and, desc, eq } from "drizzle-orm";

export const getTemplates = async () => {
  const userId = await getUserIdFromSession();
  return db
    .select()
    .from(templates)
    .where(eq(templates.userId, userId))
    .orderBy(desc(templates.createdAt));
};

export const getTemplateById = async (templateId: number) => {
  const userId = await getUserIdFromSession();
  const [template] = await db
    .select()
    .from(templates)
    .where(and(eq(templates.id, templateId), eq(templates.userId, userId)));
  return template;
};

export const getTemplateVariables = async (templateId: number) => {
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
      userId: userId,
      content: content,
    })
    .returning({ templateId: templates.id });
};

export const saveVariables = async (variables: VariableProps[]) => {
  const userId = await getUserIdFromSession();
  const templateId = variables[0]?.templateId;

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
        value: templateVariables.value,
      },
    });
};
