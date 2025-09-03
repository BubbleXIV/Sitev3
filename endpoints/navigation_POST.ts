import { db } from '../helpers/db';
import { getServerUserSession } from '../helpers/getServerUserSession';
import superjson from "superjson";
import { schema, OutputType } from "./navigation_POST.schema";
import { Transaction } from "kysely";
import { DB } from '../helpers/schema';

async function updateNavigation(trx: Transaction<DB>, items: any[]) {
  // A simple approach: delete all and re-insert.
  // For very large menus, a more nuanced update would be better.
  await trx.deleteFrom("navigationItems").execute();

  if (items.length === 0) {
    return [];
  }

  const newItems = items.map((item, index) => ({
    label: item.label,
    url: item.url,
    displayOrder: index,
    isActive: item.isActive,
    isExternal: item.isExternal,
    target: item.target
  }));

  return await trx.
  insertInto("navigationItems").
  values(newItems).
  returningAll().
  execute();
}

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

    const updatedNav = await db.transaction().execute(async (trx) => {
      return await updateNavigation(trx, input.items);
    });

    return new Response(
      superjson.stringify({ navigation: updatedNav } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error updating navigation:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: errorMessage }),
      { status: 400 }
    );
  }
}