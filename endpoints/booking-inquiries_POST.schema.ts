import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { BookingInquiries } from '../helpers/schema';

export const schema = z.object({
  contactName: z.string().min(1, "Contact name is required"),
  contactEmail: z.string().email("Invalid email address").nullable().optional(),
  characterName: z.string().nullable().optional(),
  server: z.string().nullable().optional(),
  inquiryType: z.string().min(1, "Inquiry type is required"),
  eventDate: z.date().nullable().optional(),
  expectedGuests: z.number().int().positive().nullable().optional(),
  budgetRange: z.string().nullable().optional(),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  inquiry: Selectable<BookingInquiries>;
};

export const postBookingInquiries = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/booking-inquiries`, {
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
    throw new Error(errorObject.error || "Failed to submit inquiry");
  }
  return superjson.parse<OutputType>(await result.text());
};