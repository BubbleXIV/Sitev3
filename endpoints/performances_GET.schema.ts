import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Performances } from "../helpers/schema";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type PerformanceWithStaff = Selectable<Performances> & {
  staffName: string | null;
  staffProfilePictureUrl: string | null;
};

export type OutputType = PerformanceWithStaff[];

export const getPerformances = async (
  body?: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const result = await fetch(`/_api/performances`, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse(await result.text()) as any;
    throw new Error(errorObject.error || "Failed to fetch performances");
  }
  return superjson.parse<OutputType>(await result.text());
};