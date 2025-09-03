import { db } from '../helpers/db';
import { getServerUserSession } from '../helpers/getServerUserSession';
import superjson from "superjson";
import { OutputType } from "./booking-inquiries_GET.schema";

export async function handle(request: Request) {
  try {
    const { user } = await getServerUserSession(request);
    if (user.role !== "admin") {
      return new Response(
        superjson.stringify({ error: "Forbidden: Admins only" }),
        { status: 403 }
      );
    }

    const inquiries = await db
      .selectFrom("bookingInquiries")
      .orderBy("createdAt", "desc")
      .selectAll()
      .execute();

    return new Response(superjson.stringify(inquiries satisfies OutputType), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching booking inquiries:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: "Failed to fetch inquiries", details: errorMessage }),
      { status: 500 }
    );
  }
}