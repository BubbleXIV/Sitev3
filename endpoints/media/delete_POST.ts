import { db } from '../../helpers/db';
import { getServerUserSession } from '../../helpers/getServerUserSession';
import superjson from "superjson";
import { schema, OutputType } from "./delete_POST.schema";
import { ZodError } from 'zod';

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);
    if (user.role !== "admin") {
      return new Response(
        superjson.stringify({ error: "Forbidden" }),
        { status: 403 }
      );
    }

    const json = superjson.parse(await request.text());
    const input = schema.parse(json);

    const result = await db
      .deleteFrom("mediaLibrary")
      .where("id", "=", input.id)
      .executeTakeFirst();

    if (result.numDeletedRows === 0n) {
        return new Response(
            superjson.stringify({ error: "Media item not found or already deleted." }),
            { status: 404 }
        );
    }

    return new Response(superjson.stringify({ success: true, message: "Media item deleted successfully." } satisfies OutputType));
  } catch (error) {
    console.error("Error deleting media item:", error);
    if (error instanceof ZodError) {
      return new Response(
        superjson.stringify({ error: "Invalid input", details: error.errors }),
        { status: 400 }
      );
    }
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: errorMessage }),
      { status: 500 }
    );
  }
}