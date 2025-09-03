import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../endpoints/events_GET.schema";

export const EVENTS_QUERY_KEY = ["events", "list"] as const;

/**
 * A React Query hook to fetch the list of active events.
 * It retrieves event data, ordered by date.
 */
export const useEvents = () => {
  return useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: () => getEvents(),
  });
};