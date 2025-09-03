import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { NavigationItems } from '../helpers/schema';

export const navigationItemSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
  isActive: z.boolean().default(true),
  isExternal: z.boolean().default(false),
  target: z.string().optional().nullable()
});

export const schema = z.object({
  items: z.array(navigationItemSchema)
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  navigation: Selectable<NavigationItems>[];
};

export const postNavigation = async (
body: InputType,
init?: RequestInit)
: Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/navigation`, {
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
    throw new Error(errorObject.error);
  }
  return superjson.parse<OutputType>(await result.text());
};