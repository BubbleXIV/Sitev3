import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { postSiteSettings } from "../endpoints/site-settings_POST.schema";
import { SITE_SETTINGS_QUERY_KEY } from "./useSiteSettings";

/**
 * A collection of React Query mutation hooks for updating site settings.
 * These hooks handle API calls and manage cache invalidation to keep the UI consistent.
 */
export const useSiteSettingsMutations = () => {
  const queryClient = useQueryClient();

  /**
   * Mutation to update site settings.
   */
  const useUpdateSiteSettings = () =>
    useMutation({
      mutationFn: postSiteSettings,
      onSuccess: (data) => {
        console.log("Site settings updated successfully, invalidating query.");
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: SITE_SETTINGS_QUERY_KEY });
      },
      onError: (error) => {
        console.error("Error updating site settings:", error);
        if (error instanceof Error) {
          toast.error(`Failed to update settings: ${error.message}`);
        } else {
          toast.error("An unknown error occurred while updating settings.");
        }
      },
    });

  return {
    useUpdateSiteSettings,
  };
};