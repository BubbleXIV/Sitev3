import { z } from "zod";
import superjson from "superjson";
import { StaffRole } from "../helpers/schema";

export const schema = z.object({});

export type InputType = z.infer<typeof schema>;

export type AltProfile = {
  id: number;
  name: string;
  role: StaffRole;
  bio: string | null;
  profilePictureUrl: string | null;
};

export type StaffMember = {
  id: number;
  name: string;
  role: StaffRole;
  bio: string | null;
  profilePictureUrl: string | null;
  alts: AltProfile[];
};

export type OutputType = StaffMember[];

export const getStaff = async (
  body?: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const result = await fetch(`/_api/staff`, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse(await result.text()) as any;
    throw new Error(errorObject.error || "Failed to fetch staff data");
  }
  return superjson.parse<OutputType>(await result.text());
};