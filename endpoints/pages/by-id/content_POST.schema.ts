import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { PageContentBlocks, ContentBlockTypeArrayValues } from '../../../helpers/schema';

const jsonSchema: z.ZodType<any> = z.lazy((): z.ZodType<any> =>
z.union([
z.string(),
z.number(),
z.boolean(),
z.null(),
z.array(jsonSchema),
z.record(jsonSchema)]
)
);

export const contentBlockSchema = z.object({
  blockType: z.enum(ContentBlockTypeArrayValues),
  content: jsonSchema,
  settings: jsonSchema.nullable().optional(),
  styles: jsonSchema.nullable().optional()
});

export const schema = z.object({
  pageId: z.number().int().positive(),
  contentBlocks: z.array(contentBlockSchema)
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  contentBlocks: Selectable<PageContentBlocks>[];
};

export const postPageContent = async (
body: InputType,
init?: RequestInit)
: Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/pages/by-id/content`, {
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