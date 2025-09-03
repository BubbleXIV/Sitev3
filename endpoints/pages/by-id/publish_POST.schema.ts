import { z } from "zod";
import superjson from "superjson";
import { Selectable } from "kysely";
import { Pages } from '../../../helpers/schema';

export const schema = z.object({
  id: z.number().int().positive(),
  publish: z.boolean()
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  page: Selectable<Pages>;
};

export const postPublishPage = async (
body: InputType,
init?: RequestInit)
: Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/pages/by-id/publish`, {
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