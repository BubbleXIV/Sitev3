import { db } from "../helpers/db";
import { OutputType } from "./site-settings_GET.schema";
import superjson from "superjson";

export async function handle(request: Request) {
  try {
    const settings = await db.selectFrom("siteSettings").selectAll().execute();

    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.settingKey] = setting.settingValue;
      return acc;
    }, {} as Record<string, string | null>);

    const responseData: OutputType = {
      socialTwitter: settingsMap.social_twitter ?? null,
      socialBluesky: settingsMap.social_bluesky ?? null,
      socialDiscord: settingsMap.social_discord ?? null,
    };

    return new Response(superjson.stringify(responseData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching site settings:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({
        error: "Failed to fetch site settings",
        details: errorMessage,
      }),
      { status: 500 }
    );
  }
}