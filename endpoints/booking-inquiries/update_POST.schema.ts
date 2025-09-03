import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { BookingInquiries } from '../../helpers/schema';

export const schema = z.object({
  id: z.number().int().positive(),
  status: z.string().optional(),
  priority: z.string().optional(),
  staffNotes: z.string().nullable().optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  inquiry: Selectable<BookingInquiries>;
};

export const postBookingInquiriesUpdate = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/booking-inquiries/update`, {
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
    throw new Error(errorObject.error || "Failed to update inquiry");
  }
  return superjson.parse<OutputType>(await result.text());
};