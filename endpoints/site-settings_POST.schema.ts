import { z } from "zod";
import superjson from "superjson";

export const schema = z.object({
  siteTitle: z.string().optional().nullable(),
  siteDescription: z.string().optional().nullable(),
  socialTwitter: z.string().url("Invalid Twitter URL").optional().nullable(),
  socialBluesky: z.string().url("Invalid Bluesky URL").optional().nullable(),
  socialDiscord: z.string().url("Invalid Discord URL").optional().nullable(),
});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  success: true;
  message: string;
};

export const postSiteSettings = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = schema.parse(body);
  const result = await fetch(`/_api/site-settings`, {
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
    throw new Error(errorObject.error || "Failed to update site settings");
  }
  return superjson.parse<OutputType>(await result.text());
};