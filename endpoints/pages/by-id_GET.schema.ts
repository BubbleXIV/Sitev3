import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Pages, PageContentBlocks } from '../../helpers/schema';

export const schema = z.object({
  id: z.number().int().positive()
});

export type InputType = z.infer<typeof schema>;

export type PageWithContent = Selectable<Pages> & {
  contentBlocks: Selectable<PageContentBlocks>[];
};

export type OutputType = {
  page: PageWithContent;
};

export const getPageById = async (
params: InputType,
init?: RequestInit)
: Promise<OutputType> => {
  const validatedParams = schema.parse(params);
  const result = await fetch(`/_api/pages/by-id?id=${validatedParams.id}`, {
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