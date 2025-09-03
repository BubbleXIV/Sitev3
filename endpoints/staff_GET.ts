import { db } from "../helpers/db";
import { OutputType } from "./staff_GET.schema";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Staff, StaffAlts } from "../helpers/schema";

export async function handle(request: Request) {
  try {
    const staffMembers = await db
      .selectFrom("staff")
      .selectAll()
      .where("isActive", "=", true)
      .orderBy("displayOrder", "asc")
      .execute();

    const staffIds = staffMembers.map((s) => s.id);
    let alts: Selectable<StaffAlts>[] = [];

    if (staffIds.length > 0) {
      alts = await db
        .selectFrom("staffAlts")
        .selectAll()
        .where("staffId", "in", staffIds)
        .orderBy("altOrder", "asc")
        .execute();
    }

    const altsByStaffId = alts.reduce(
      (acc, alt) => {
        if (!acc[alt.staffId]) {
          acc[alt.staffId] = [];
        }
        acc[alt.staffId].push(alt);
        return acc;
      },
      {} as Record<number, Selectable<StaffAlts>[]>
    );

    const responseData: OutputType = staffMembers.map((staff) => ({
      id: staff.id,
      name: staff.name,
      role: staff.role,
      bio: staff.bio,
      profilePictureUrl: staff.profilePictureUrl,
      alts: (altsByStaffId[staff.id] || []).map((alt) => ({
        id: alt.id,
        name: alt.name,
        role: alt.role,
        bio: alt.bio,
        profilePictureUrl: alt.profilePictureUrl,
      })),
    }));

    return new Response(superjson.stringify(responseData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching staff:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: "Failed to fetch staff data", details: errorMessage }),
      { status: 500 }
    );
  }
}