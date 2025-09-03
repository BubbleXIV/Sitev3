import { db } from '../../helpers/db';
import { getServerUserSession } from '../../helpers/getServerUserSession';
import superjson from "superjson";
import { schema, OutputType } from "./photos_POST.schema";

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
    const { id, ...photoData } = input;

    let result;
    if (id) {
      // Update existing photo
      result = await db
        .updateTable("galleryPhotos")
        .set({ ...photoData, updatedAt: new Date() })
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirstOrThrow();
    } else {
      // Create new photo
      result = await db
        .insertInto("galleryPhotos")
        .values(photoData)
        .returningAll()
        .executeTakeFirstOrThrow();
    }

    return new Response(superjson.stringify({ photo: result } satisfies OutputType), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating/updating gallery photo:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: errorMessage }),
      { status: 400 }
    );
  }
}