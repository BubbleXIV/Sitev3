import { db } from '../helpers/db';
import { getServerUserSession } from '../helpers/getServerUserSession';
import superjson from "superjson";
import { schema, OutputType } from "./performances_POST.schema";

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
    const { id, ...performanceData } = input;

    let result;
    if (id) {
      // Update existing performance
      result = await db
        .updateTable("performances")
        .set({ ...performanceData, updatedAt: new Date() })
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirstOrThrow();
    } else {
      // Create new performance
      result = await db
        .insertInto("performances")
        .values(performanceData)
        .returningAll()
        .executeTakeFirstOrThrow();
    }

    return new Response(superjson.stringify({ performance: result } satisfies OutputType), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating/updating performance:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: errorMessage }),
      { status: 400 }
    );
  }
}