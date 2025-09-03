import { useQuery } from "@tanstack/react-query";
import { getPages } from "../endpoints/pages_GET.schema";

export const PAGES_QUERY_KEY = ["pages"] as const;

/**
 * A React Query hook to fetch the list of all pages.
 * This is typically used in admin dashboards for page management.
 */
export const usePages = () => {
  return useQuery({
    queryKey: PAGES_QUERY_KEY,
    queryFn: () => getPages(),
    placeholderData: (previousData) => previousData,
  });
};