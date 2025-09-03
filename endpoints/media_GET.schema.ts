import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { MediaLibrary } from '../helpers/schema';

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  media: Selectable<MediaLibrary>[];
};

export const getMedia = async (
init?: RequestInit)
: Promise<OutputType> => {
  const result = await fetch(`/_api/media`, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });
  if (!result.ok) {
    const errorObject = superjson.parse(await result.text()) as any;
    throw new Error(errorObject.error);
  }
  return superjson.parse<OutputType>(await result.text());
};