import { db } from '../helpers/db';
import { getServerUserSession } from '../helpers/getServerUserSession';
import superjson from "superjson";
import { schema, OutputType, InputType } from "./site-settings_POST.schema";
import { ZodError } from 'zod';
import { Transaction } from 'kysely';
import { DB } from '../helpers/schema';

async function upsertSetting(trx: Transaction<DB>, key: string, value: string | null) {
  return trx
    .insertInto('siteSettings')
    .values({ settingKey: key, settingValue: value })
    .onConflict((oc) => oc
      .column('settingKey')
      .doUpdateSet({ settingValue: value })
    )
    .execute();
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

    await db.transaction().execute(async (trx) => {
      const upsertPromises = Object.entries(input).map(([key, value]) => 
        upsertSetting(trx, key, value)
      );
      await Promise.all(upsertPromises);
    });

    return new Response(superjson.stringify({ success: true, message: "Site settings updated successfully." } satisfies OutputType));
  } catch (error) {
    console.error("Error updating site settings:", error);
    if (error instanceof ZodError) {
      return new Response(
        superjson.stringify({ error: "Invalid input", details: error.errors }),
        { status: 400 }
      );
    }
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: errorMessage }),
      { status: 500 }
    );
  }
}