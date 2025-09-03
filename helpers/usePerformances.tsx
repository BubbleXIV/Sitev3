import { useQuery } from "@tanstack/react-query";
import { getPerformances } from "../endpoints/performances_GET.schema";

export const PERFORMANCES_QUERY_KEY = ["performances", "list"] as const;

/**
 * A React Query hook to fetch the list of active performances.
 * It retrieves performance data including associated staff information.
 */
export const usePerformances = () => {
  return useQuery({
    queryKey: PERFORMANCES_QUERY_KEY,
    queryFn: () => getPerformances(),
  });
};