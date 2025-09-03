import { useQuery } from "@tanstack/react-query";
import { getGallery } from "../endpoints/gallery_GET.schema";

export const GALLERY_QUERY_KEY = ["gallery", "list"] as const;

/**
 * A React Query hook to fetch all active gallery categories and their associated photos.
 * The data is structured with photos nested within their categories.
 */
export const useGallery = () => {
  return useQuery({
    queryKey: GALLERY_QUERY_KEY,
    queryFn: () => getGallery(),
  });
};