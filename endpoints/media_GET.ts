import { db } from '../helpers/db';
import { getServerUserSession } from '../helpers/getServerUserSession';
import superjson from "superjson";
import { OutputType } from "./media_GET.schema";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);
    if (user.role !== "admin") {
      return new Response(
        superjson.stringify({ error: "Forbidden" }),
        { status: 403 }
      );
    }

    const mediaItems = await db.
    selectFrom("mediaLibrary").
    selectAll().
    orderBy("createdAt", "desc").
    execute();

    return new Response(superjson.stringify({ media: mediaItems } satisfies OutputType));
  } catch (error) {
    console.error("Error fetching media library:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: errorMessage }),
      { status: 400 }
    );
  }
}