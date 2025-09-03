import { db } from '../../helpers/db';
import { getServerUserSession } from '../../helpers/getServerUserSession';
import superjson from "superjson";
import { schema, OutputType } from "./categories_POST.schema";

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
    const { id, ...categoryData } = input;

    let result;
    if (id) {
      // Update existing category
      result = await db
        .updateTable("galleryCategories")
        .set(categoryData)
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirstOrThrow();
    } else {
      // Create new category
      result = await db
        .insertInto("galleryCategories")
        .values(categoryData)
        .returningAll()
        .executeTakeFirstOrThrow();
    }

    return new Response(superjson.stringify({ category: result } satisfies OutputType), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating/updating gallery category:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: errorMessage }),
      { status: 400 }
    );
  }
}