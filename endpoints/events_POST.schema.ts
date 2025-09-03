import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Events } from '../helpers/schema';

export const schema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  eventDate: z.date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format").nullable().optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "End time must be in HH:MM format").nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  eventType: z.string().nullable().optional(),
  coverCharge: z.number().nullable().optional(),
  rsvpRequired: z.boolean().default(false),
  maxAttendees: z.number().nullable().optional(),
  featuredStaffIds: z.array(z.number()).nullable().optional(),
  specialRequirements: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  event: Selectable<Events>;
};

export const postEvents = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/events`, {
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
    throw new Error(errorObject.error || "Failed to save event");
  }
  return superjson.parse<OutputType>(await result.text());
};