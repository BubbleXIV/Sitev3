import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { MediaLibrary } from '../../helpers/schema';

export const schema = z.object({
  id: z.number().int(),
  altText: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  filename: z.string().min(1, "Filename cannot be empty.").optional(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  mediaItem: Selectable<MediaLibrary>;
};

export const postMediaUpdate = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/media/update`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse(await result.text()) as any;
    throw new Error(errorObject.error || "Failed to update media item");
  }
  return superjson.parse<OutputType>(await result.text());
};