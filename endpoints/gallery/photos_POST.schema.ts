import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { GalleryPhotos } from '../../helpers/schema';

export const schema = z.object({
  id: z.number().optional(),
  imageUrl: z.string().url("A valid image URL is required"),
  categoryId: z.number().int().positive("A category must be selected"),
  title: z.string().nullable().optional(),
  altText: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  photographerCredit: z.string().nullable().optional(),
  eventDate: z.date().nullable().optional(),
  displayOrder: z.number().int().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  photo: Selectable<GalleryPhotos>;
};

export const postGalleryPhotos = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/gallery/photos`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });
  if (!result.ok) {
    const errorObject = superjson.parse(await result.text()) as any;
    throw new Error(errorObject.error || "Failed to save gallery photo");
  }
  return superjson.parse<OutputType>(await result.text());
};