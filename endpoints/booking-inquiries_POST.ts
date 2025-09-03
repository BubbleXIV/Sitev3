import { db } from '../helpers/db';
import superjson from "superjson";
import { schema, OutputType } from "./booking-inquiries_POST.schema";

export async function handle(request: Request) {
  try {
    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const newInquiry = await db
      .insertInto("bookingInquiries")
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ inquiry: newInquiry } satisfies OutputType), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error submitting booking inquiry:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: errorMessage }),
      { status: 400 }
    );
  }
}