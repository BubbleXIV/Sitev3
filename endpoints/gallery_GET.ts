import { db } from "../helpers/db";
import { OutputType, GalleryCategoryWithPhotos } from "./gallery_GET.schema";
import superjson from "superjson";
import { Selectable } from "kysely";
import { GalleryCategories, GalleryPhotos } from "../helpers/schema";

export async function handle(request: Request) {
  try {
    const categories = await db
      .selectFrom("galleryCategories")
      .where("isActive", "=", true)
      .orderBy("displayOrder", "asc")
      .selectAll()
      .execute();

    const categoryIds = categories.map((c) => c.id);
    let photos: Selectable<GalleryPhotos>[] = [];

    if (categoryIds.length > 0) {
      photos = await db
        .selectFrom("galleryPhotos")
        .where("isActive", "=", true)
        .where("categoryId", "in", categoryIds)
        .orderBy("displayOrder", "asc")
        .selectAll()
        .execute();
    }

    const photosByCategoryId = photos.reduce(
      (acc, photo) => {
        if (photo.categoryId) {
          if (!acc[photo.categoryId]) {
            acc[photo.categoryId] = [];
          }
          acc[photo.categoryId].push(photo);
        }
        return acc;
      },
      {} as Record<number, Selectable<GalleryPhotos>[]>
    );

    const responseData: OutputType = categories.map((category) => ({
      ...category,
      photos: photosByCategoryId[category.id] || [],
    }));

    return new Response(superjson.stringify(responseData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching gallery data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      superjson.stringify({ error: "Failed to fetch gallery data", details: errorMessage }),
      { status: 500 }
    );
  }
}