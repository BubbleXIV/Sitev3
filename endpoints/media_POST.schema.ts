import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { MediaLibrary } from '../helpers/schema';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

export const schema = z.object({
  file: z.
  instanceof(File).
  refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`).
  refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    ".jpg, .jpeg, .png, .webp and .gif files are accepted."
  ),
  altText: z.string().optional().nullable(),
  description: z.string().optional().nullable()
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  mediaItem: Selectable<MediaLibrary>;
};

export const postMedia = async (
formData: FormData,
init?: RequestInit)
: Promise<OutputType> => {
  // Note: We don't stringify FormData. The browser handles it.
  const result = await fetch(`/_api/media`, {
    method: "POST",
    body: formData,
    ...init
    // Do not set Content-Type header, browser will set it with boundary
  });
  if (!result.ok) {
    const errorObject = superjson.parse(await result.text()) as any;
    throw new Error(errorObject.error);
  }
  return superjson.parse<OutputType>(await result.text());
};