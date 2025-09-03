import { db } from '../../helpers/db';
import { getServerUserSession } from '../../helpers/getServerUserSession';
import superjson from "superjson";
import { schema, OutputType } from "./by-id_GET.schema";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);
    if (user.role !== "admin") {
      return new Response(
        superjson.stringify({ error: "Forbidden" }),
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const input = schema.parse({
      id: Number(url.searchParams.get("id"))
    });

    const page = await db.
    selectFrom("pages").
    selectAll().
    where("id", "=", input.id).
    executeTakeFirst();

    if (!page) {
      return new Response(
        superjson.stringify({ error: "Page not found" }),
        { status: 404 }
      );
    }

    const contentBlocks = await db.
    selectFrom("pageContentBlocks").
    selectAll().
    where("pageId", "=", input.id).
    orderBy("displayOrder", "asc").
    execute();

    return new Response(
      superjson.stringify({ page: { ...page, contentBlocks } } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error fetching page by id:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: errorMessage }),
      { status: 400 }
    );
  }
}