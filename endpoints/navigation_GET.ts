import { db } from '../helpers/db';
import superjson from "superjson";
import { OutputType } from "./navigation_GET.schema";

export async function handle(request: Request) {
  try {
    // Navigation is public, so no authentication is needed to fetch it.
    // Admins will use a different endpoint to update it.
    const navItems = await db.
    selectFrom("navigationItems").
    selectAll().
    where("isActive", "=", true).
    orderBy("displayOrder", "asc").
    execute();

    return new Response(superjson.stringify({ navigation: navItems } satisfies OutputType));
  } catch (error) {
    console.error("Error fetching navigation:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: errorMessage }),
      { status: 500 } // Use 500 for public-facing data fetch errors
    );
  }
}