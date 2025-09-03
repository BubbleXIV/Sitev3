import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postNavigation,
  InputType as NavigationInputType,
} from "../endpoints/navigation_POST.schema";
import { NAVIGATION_QUERY_KEY } from "./useNavigation";

/**
 * Provides React Query mutation hooks for navigation management.
 */
export const useNavigationMutations = () => {
  const queryClient = useQueryClient();

  /**
   * Mutation to update the entire navigation structure.
   * Replaces the existing navigation with the new set of items provided.
   */
  const useUpdateNavigation = () =>
    useMutation({
      mutationFn: (items: NavigationInputType) => postNavigation(items),
      onSuccess: () => {
        console.log(
          "Navigation updated successfully, invalidating navigation query."
        );
        queryClient.invalidateQueries({ queryKey: NAVIGATION_QUERY_KEY });
      },
      onError: (error) => {
        console.error("Error updating navigation:", error);
      },
    });

  return { useUpdateNavigation };
};