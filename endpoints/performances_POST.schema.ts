import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Performances } from '../helpers/schema';

export const schema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  staffId: z.number().nullable().optional(),
  dayOfWeek: z.number().min(0).max(6).nullable().optional(), // 0 = Sunday, 6 = Saturday
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "End time must be in HH:MM format"),
  recurring: z.boolean().default(false),
  isActive: z.boolean().default(true),
  specialNotes: z.string().nullable().optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  performance: Selectable<Performances>;
};

export const postPerformances = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/performances`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });
  if (!result.ok) {
    const errorObject = superjson.parse(await result.text()) as any;
    throw new Error(errorObject.error || "Failed to save performance");
  }
  return superjson.parse<OutputType>(await result.text());
};