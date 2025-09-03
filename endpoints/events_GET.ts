import { db } from "../helpers/db";
import { OutputType } from "./events_GET.schema";
import superjson from "superjson";

export async function handle(request: Request) {
  try {
    const events = await db
      .selectFrom("events")
      .where("isActive", "=", true)
      .orderBy("eventDate", "desc")
      .selectAll()
      .execute();

    return new Response(superjson.stringify(events satisfies OutputType), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: "Failed to fetch events", details: errorMessage }),
      { status: 500 }
    );
  }
}