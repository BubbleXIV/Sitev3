import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMedia } from "../endpoints/media_POST.schema";
import { postMediaUpdate } from "../endpoints/media/update_POST.schema";
import { postMediaDelete } from "../endpoints/media/delete_POST.schema";
import { MEDIA_QUERY_KEY } from "./useMedia";

/**
 * Provides React Query mutation hooks for media management.
 */
export const useMediaMutations = () => {
  const queryClient = useQueryClient();

  /**
   * Mutation to upload a new media file.
   * Expects a FormData object as input.
   */
  const useUploadMedia = () =>
    useMutation({
      mutationFn: (formData: FormData) => postMedia(formData),
      onSuccess: () => {
        console.log("Media uploaded successfully, invalidating media query.");
        queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
      },
      onError: (error) => {
        console.error("Error uploading media:", error);
      },
    });

  /**
   * Mutation to update an existing media file's details.
   * Expects an object with id and optional fields to update.
   */
  const useUpdateMedia = () =>
    useMutation({
      mutationFn: postMediaUpdate,
      onSuccess: () => {
        console.log("Media updated successfully, invalidating media query.");
        queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
      },
      onError: (error) => {
        console.error("Error updating media:", error);
      },
    });

  /**
   * Mutation to delete a media file.
   * Expects an object with the media id.
   */
  const useDeleteMedia = () =>
    useMutation({
      mutationFn: postMediaDelete,
      onSuccess: () => {
        console.log("Media deleted successfully, invalidating media query.");
        queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
      },
      onError: (error) => {
        console.error("Error deleting media:", error);
      },
    });

  return { useUploadMedia, useUpdateMedia, useDeleteMedia };
};