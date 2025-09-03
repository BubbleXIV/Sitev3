import { db } from '../../helpers/db';
import { getServerUserSession } from '../../helpers/getServerUserSession';
import superjson from "superjson";
import { schema, OutputType, InputType } from "./update_POST.schema";
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

    const { id, ...updateData } = input;

    if (Object.keys(updateData).length === 0) {
      return new Response(
        superjson.stringify({ error: "No update data provided." }),
        { status: 400 }
      );
    }

    const updatedMedia = await db
      .updateTable("mediaLibrary")
      .set(updateData)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ mediaItem: updatedMedia } satisfies OutputType));
  } catch (error) {
    console.error("Error updating media item:", error);
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