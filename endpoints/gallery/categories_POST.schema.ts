import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { GalleryCategories } from '../../helpers/schema';

export const schema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Category name is required"),
  description: z.string().nullable().optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().default(true),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  category: Selectable<GalleryCategories>;
};

export const postGalleryCategories = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/gallery/categories`, {
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
    throw new Error(errorObject.error || "Failed to save gallery category");
  }
  return superjson.parse<OutputType>(await result.text());
};