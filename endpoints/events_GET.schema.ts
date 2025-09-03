import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Events } from "../helpers/schema";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type OutputType = Selectable<Events>[];

export const getEvents = async (
  body?: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const result = await fetch(`/_api/events`, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse(await result.text()) as any;
    throw new Error(errorObject.error || "Failed to fetch events");
  }
  return superjson.parse<OutputType>(await result.text());
};