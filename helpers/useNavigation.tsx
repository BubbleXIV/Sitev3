import { useQuery } from "@tanstack/react-query";
import { getNavigation } from "../endpoints/navigation_GET.schema";

export const NAVIGATION_QUERY_KEY = ["navigation"] as const;

/**
 * A React Query hook to fetch the site's navigation items.
 * This is used for rendering the main navigation bar and for the navigation management UI.
 */
export const useNavigation = () => {
  return useQuery({
    queryKey: NAVIGATION_QUERY_KEY,
    queryFn: () => getNavigation(),
    placeholderData: (previousData) => previousData,
  });
};