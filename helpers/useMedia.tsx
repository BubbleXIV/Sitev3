import { useQuery } from "@tanstack/react-query";
import { getMedia } from "../endpoints/media_GET.schema";

export const MEDIA_QUERY_KEY = ["media"] as const;

/**
 * A React Query hook to fetch all items from the media library.
 */
export const useMedia = () => {
  return useQuery({
    queryKey: MEDIA_QUERY_KEY,
    queryFn: () => getMedia(),
    placeholderData: (previousData) => previousData,
  });
};