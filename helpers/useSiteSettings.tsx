import { useQuery } from "@tanstack/react-query";
import { getSiteSettings } from "../endpoints/site-settings_GET.schema";

export const SITE_SETTINGS_QUERY_KEY = ["siteSettings"] as const;

export const useSiteSettings = () => {
  return useQuery({
    queryKey: SITE_SETTINGS_QUERY_KEY,
    queryFn: () => getSiteSettings(),
  });
};