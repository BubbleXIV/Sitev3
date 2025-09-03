import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { MenuItems } from "../helpers/schema";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type OutputType = Selectable<MenuItems>[];

export const getMenu = async (
  body?: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const result = await fetch(`/_api/menu`, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse(await result.text()) as any;
    throw new Error(errorObject.error || "Failed to fetch menu data");
  }
  return superjson.parse<OutputType>(await result.text());
};