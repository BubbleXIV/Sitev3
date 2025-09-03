import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postPages } from "../endpoints/pages_POST.schema";
import { postPageById } from "../endpoints/pages/by-id_POST.schema";
import { postPageContent } from "../endpoints/pages/by-id/content_POST.schema";
import { postPublishPage } from "../endpoints/pages/by-id/publish_POST.schema";
import { postDeletePage } from "../endpoints/pages/by-id/delete_POST.schema";
import { PAGES_QUERY_KEY } from "./usePages";
import { pageQueryKey } from "./usePage";
import { Selectable } from "kysely";
import { Pages } from "./schema";

/**
 * A collection of React Query mutation hooks for creating, updating, and deleting pages.
 * These hooks handle API calls and manage cache invalidation to keep the UI consistent.
 */
export const usePageMutations = () => {
  const queryClient = useQueryClient();

  /**
   * Mutation to create a new page.
   */
  const useCreatePage = () =>
    useMutation({
      mutationFn: postPages,
      onSuccess: () => {
        console.log("Page created successfully, invalidating pages query.");
        queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY });
      },
      onError: (error) => {
        console.error("Error creating page:", error);
      },
    });

  /**
   * Mutation to update a page's metadata (title, route, status, etc.).
   */
  const useUpdatePage = () =>
    useMutation({
      mutationFn: postPageById,
      onSuccess: (data) => {
        console.log(`Page ${data.page.id} updated, invalidating queries.`);
        queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY });
        queryClient.invalidateQueries({
          queryKey: pageQueryKey(data.page.id),
        });
        // Optimistically update the list query
        queryClient.setQueryData(
          PAGES_QUERY_KEY,
          (oldData?: { pages: Selectable<Pages>[] }) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((p) =>
                p.id === data.page.id ? data.page : p
              ),
            };
          }
        );
      },
      onError: (error) => {
        console.error("Error updating page:", error);
      },
    });

  /**
   * Mutation to update the content blocks of a page.
   */
  const useUpdatePageContent = () =>
    useMutation({
      mutationFn: postPageContent,
      onSuccess: (data, variables) => {
        console.log(
          `Page content for ${variables.pageId} updated, invalidating page query.`
        );
        queryClient.invalidateQueries({
          queryKey: pageQueryKey(variables.pageId),
        });
      },
      onError: (error) => {
        console.error("Error updating page content:", error);
      },
    });

  /**
   * Mutation to publish or unpublish a page.
   */
  const usePublishPage = () =>
    useMutation({
      mutationFn: postPublishPage,
      onSuccess: (data) => {
        console.log(
          `Page ${data.page.id} publish status changed, invalidating queries.`
        );
        queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY });
        queryClient.invalidateQueries({
          queryKey: pageQueryKey(data.page.id),
        });
        // Optimistically update the list query
        queryClient.setQueryData(
          PAGES_QUERY_KEY,
          (oldData?: { pages: Selectable<Pages>[] }) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((p) =>
                p.id === data.page.id ? data.page : p
              ),
            };
          }
        );
      },
      onError: (error) => {
        console.error("Error changing page publish status:", error);
      },
    });

  /**
   * Mutation to delete a page.
   */
  const useDeletePage = () =>
    useMutation({
      mutationFn: postDeletePage,
      onSuccess: (data, variables) => {
        console.log(`Page ${variables.id} deleted, invalidating pages query.`);
        queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY });
        queryClient.removeQueries({ queryKey: pageQueryKey(variables.id) });
      },
      onError: (error) => {
        console.error("Error deleting page:", error);
      },
    });

  return {
    useCreatePage,
    useUpdatePage,
    useUpdatePageContent,
    usePublishPage,
    useDeletePage,
  };
};