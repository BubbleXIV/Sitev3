import { db } from '../../../helpers/db';
import { getServerUserSession } from '../../../helpers/getServerUserSession';
import superjson from "superjson";
import { schema, OutputType } from "./publish_POST.schema";
import { PageStatus } from '../../../helpers/schema';

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

    const newStatus: PageStatus = input.publish ? "published" : "draft";

    const updatedPage = await db.
    updateTable("pages").
    set({
      status: newStatus,
      updatedBy: user.id,
      updatedAt: new Date()
    }).
    where("id", "=", input.id).
    returningAll().
    executeTakeFirstOrThrow();

    return new Response(
      superjson.stringify({ page: updatedPage } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error updating page publish status:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: errorMessage }),
      { status: 400 }
    );
  }
}