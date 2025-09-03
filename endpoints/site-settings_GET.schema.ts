import { z } from "zod";
import superjson from "superjson";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type OutputType = {
  socialTwitter: string | null;
  socialBluesky: string | null;
  socialDiscord: string | null;
};

export const getSiteSettings = async (
  body?: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const result = await fetch(`/_api/site-settings`, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse(await result.text()) as any;
    throw new Error(errorObject.error || "Failed to fetch site settings");
  }
  return superjson.parse<OutputType>(await result.text());
};