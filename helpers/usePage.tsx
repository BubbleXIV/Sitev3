import { useQuery } from "@tanstack/react-query";
import { getPageById } from "../endpoints/pages/by-id_GET.schema";

export const pageQueryKey = (id: number) => ["page", id] as const;

/**
 * A React Query hook to fetch a single page by its ID, including its content blocks.
 * @param id The ID of the page to fetch. The query is disabled if the ID is not a positive number.
 */
export const usePage = (id: number | undefined | null) => {
  return useQuery({
    queryKey: pageQueryKey(id!),
    queryFn: () => getPageById({ id: id! }),
    enabled: !!id && id > 0,
    placeholderData: (previousData) => previousData,
  });
};