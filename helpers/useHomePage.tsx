import { useQuery } from "@tanstack/react-query";
import { getPageById } from "../endpoints/pages/by-id_GET.schema";

export const homePageQueryKey = ["page", "home"] as const;

/**
 * A React Query hook to fetch the home page content.
 * This assumes there's a page marked as homepage or with route "/"
 */
export const useHomePage = () => {
  return useQuery({
    queryKey: homePageQueryKey,
    queryFn: async () => {
      // For now, we'll assume the home page has ID 1
      // In a real implementation, you might query by isHomepage flag or route
      try {
        return await getPageById({ id: 1 });
      } catch (error) {
        // Return null if no home page found in database
        return null;
      }
    },
    placeholderData: (previousData) => previousData,
  });
};