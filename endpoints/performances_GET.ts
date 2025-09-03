import { db } from "../helpers/db";
import { OutputType } from "./performances_GET.schema";
import superjson from "superjson";

export async function handle(request: Request) {
  try {
    const performances = await db
      .selectFrom("performances")
      .leftJoin("staff", "staff.id", "performances.staffId")
      .where("performances.isActive", "=", true)
      .selectAll("performances")
      .select(["staff.name as staffName", "staff.profilePictureUrl as staffProfilePictureUrl"])
      .orderBy("performances.dayOfWeek", "asc")
      .orderBy("performances.startTime", "asc")
      .execute();

    return new Response(superjson.stringify(performances satisfies OutputType), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching performances:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: "Failed to fetch performances", details: errorMessage }),
      { status: 500 }
    );
  }
}