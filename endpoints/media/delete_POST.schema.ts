import { z } from "zod";
import superjson from "superjson";

export const schema = z.object({
  id: z.number().int("ID must be an integer"),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  success: true;
  message: string;
};

export const postMediaDelete = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/media/delete`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse(await result.text()) as any;
    throw new Error(errorObject.error || "Failed to delete media item");
  }
  return superjson.parse<OutputType>(await result.text());
};