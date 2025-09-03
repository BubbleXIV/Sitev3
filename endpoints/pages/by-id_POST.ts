import { db } from '../../helpers/db';
import { getServerUserSession } from '../../helpers/getServerUserSession';
import superjson from "superjson";
import { schema, OutputType } from "./by-id_POST.schema";

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

    const updatedPage = await db.
    updateTable("pages").
    set({
      ...updateData,
      updatedBy: user.id,
      updatedAt: new Date()
    }).
    where("id", "=", id).
    returningAll().
    executeTakeFirstOrThrow();

    return new Response(
      superjson.stringify({ page: updatedPage } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error updating page metadata:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: errorMessage }),
      { status: 400 }
    );
  }
}