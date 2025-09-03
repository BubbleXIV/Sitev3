import { db } from '../helpers/db';
import { getServerUserSession } from '../helpers/getServerUserSession';
import superjson from "superjson";
import { schema, OutputType } from "./events_POST.schema";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);
    if (user.role !== "admin") {
      return new Response(
        superjson.stringify({ error: "Forbidden: Admins only" }),
        { status: 403 }
      );
    }

    const json = superjson.parse(await request.text());
    const input = schema.parse(json);
    const { id, ...eventData } = input;

    let result;
    if (id) {
      // Update existing event
      result = await db
        .updateTable("events")
        .set({ ...eventData, updatedAt: new Date() })
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirstOrThrow();
    } else {
      // Create new event
      result = await db
        .insertInto("events")
        .values(eventData)
        .returningAll()
        .executeTakeFirstOrThrow();
    }

    return new Response(superjson.stringify({ event: result } satisfies OutputType), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating/updating event:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: errorMessage }),
      { status: 400 }
    );
  }
}