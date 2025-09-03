import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Pages, PageStatusArrayValues } from '../../helpers/schema';

export const schema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1, "Title is required").optional(),
  route: z.string().min(1, "Route is required").regex(/^[a-z0-9-]+$/, "Route can only contain lowercase letters, numbers, and hyphens").optional(),
  status: z.enum(PageStatusArrayValues).optional(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  metaKeywords: z.string().optional().nullable(),
  ogImageUrl: z.string().url().optional().nullable(),
  showInNavigation: z.boolean().optional(),
  isHomepage: z.boolean().optional()
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  page: Selectable<Pages>;
};

export const postPageById = async (
body: InputType,
init?: RequestInit)
: Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/pages/by-id`, {
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