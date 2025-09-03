import { db } from "../helpers/db";
import { OutputType } from "./menu_GET.schema";
import superjson from "superjson";

export async function handle(request: Request) {
  try {
    const menuItems = await db
      .selectFrom("menuItems")
      .selectAll()
      .where("isAvailable", "=", true)
      .orderBy("category", "asc")
      .orderBy("displayOrder", "asc")
      .execute();

    return new Response(superjson.stringify(menuItems satisfies OutputType), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: "Failed to fetch menu data", details: errorMessage }),
      { status: 500 }
    );
  }
}