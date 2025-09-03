import { db } from '../helpers/db';
import { getServerUserSession } from '../helpers/getServerUserSession';
import superjson from "superjson";
import { schema, OutputType } from "./pages_POST.schema";

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

    const newPage = await db.
    insertInto("pages").
    values({
      title: input.title,
      route: input.route,
      status: "draft",
      createdBy: user.id,
      updatedBy: user.id
    }).
    returningAll().
    executeTakeFirstOrThrow();

    return new Response(superjson.stringify({ page: newPage } satisfies OutputType));
  } catch (error) {
    console.error("Error creating page:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: errorMessage }),
      { status: 400 }
    );
  }
}