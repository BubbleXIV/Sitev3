import { db } from '../../../helpers/db';
import { getServerUserSession } from '../../../helpers/getServerUserSession';
import superjson from "superjson";
import { schema, OutputType } from "./content_POST.schema";
import { Transaction } from "kysely";
import { DB } from '../../../helpers/schema';

async function updateContentBlocks(trx: Transaction<DB>, pageId: number, contentBlocks: any[]) {
  // Delete existing blocks for the page
  await trx.deleteFrom("pageContentBlocks").where("pageId", "=", pageId).execute();

  if (contentBlocks.length === 0) {
    return [];
  }

  // Insert new blocks
  const newBlocks = contentBlocks.map((block, index) => ({
    pageId: pageId,
    blockType: block.blockType,
    content: block.content,
    settings: block.settings,
    styles: block.styles,
    displayOrder: index
  }));

  return await trx.
  insertInto("pageContentBlocks").
  values(newBlocks).
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

    const updatedBlocks = await db.transaction().execute(async (trx) => {
      // Verify page exists and belongs to the user's scope if necessary
      const page = await trx.
      selectFrom("pages").
      select("id").
      where("id", "=", input.pageId).
      executeTakeFirst();

      if (!page) {
        throw new Error("Page not found");
      }

      return await updateContentBlocks(trx, input.pageId, input.contentBlocks);
    });

    return new Response(
      superjson.stringify({ contentBlocks: updatedBlocks } satisfies OutputType)
    );
  } catch (error) {
    console.error("Error updating page content:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: errorMessage }),
      { status: 400 }
    );
  }
}