import { db } from '../helpers/db';
import { getServerUserSession } from '../helpers/getServerUserSession';
import superjson from "superjson";
import { OutputType } from "./pages_GET.schema";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);
    if (user.role !== "admin") {
      return new Response(
        superjson.stringify({ error: "Forbidden" }),
        { status: 403 }
      );
    }

    const pages = await db.
    selectFrom("pages").
    selectAll().
    orderBy("displayOrder", "asc").
    orderBy("createdAt", "desc").
    execute();

    return new Response(superjson.stringify({ pages } satisfies OutputType));
  } catch (error) {
    console.error("Error fetching pages:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: errorMessage }),
      { status: 400 }
    );
  }
}