import { db } from '../../../helpers/db';
import { getServerUserSession } from '../../../helpers/getServerUserSession';
import superjson from "superjson";
import { schema, OutputType } from "./delete_POST.schema";

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

    const result = await db.transaction().execute(async (trx) => {
      // Prevent deleting the homepage
      const page = await trx.
      selectFrom("pages").
      select("isHomepage").
      where("id", "=", input.id).
      executeTakeFirst();

      if (!page) {
        throw new Error("Page not found");
      }
      if (page.isHomepage) {
        throw new Error("Cannot delete the homepage.");
      }

      // Delete associated content blocks first due to foreign key constraints
      await trx.deleteFrom("pageContentBlocks").where("pageId", "=", input.id).execute();

      // Then delete the page
      const deleteResult = await trx.
      deleteFrom("pages").
      where("id", "=", input.id).
      executeTakeFirst();

      return deleteResult;
    });

    if (result.numDeletedRows === 0n) {
      return new Response(
        superjson.stringify({ error: "Page not found or already deleted" }),
        { status: 404 }
      );
    }

    return new Response(
      superjson.stringify({ success: true } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error deleting page:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: errorMessage }),
      { status: 400 }
    );
  }
}