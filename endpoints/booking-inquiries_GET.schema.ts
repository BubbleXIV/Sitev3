import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { BookingInquiries } from "../helpers/schema";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type OutputType = Selectable<BookingInquiries>[];

export const getBookingInquiries = async (
  body?: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const result = await fetch(`/_api/booking-inquiries`, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse(await result.text()) as any;
    throw new Error(errorObject.error || "Failed to fetch booking inquiries");
  }
  return superjson.parse<OutputType>(await result.text());
};