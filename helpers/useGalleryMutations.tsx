import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GALLERY_QUERY_KEY } from "./useGallery";
import { toast } from "sonner";

// NOTE: The following imports are placeholders for endpoint schemas that are not yet created.
// import { postGalleryCategories, InputType as CreateCategoryInput } from "../endpoints/gallery/categories_POST.schema";
// import { postDeleteGalleryCategory, InputType as DeleteCategoryInput } from "../endpoints/gallery/categories/by-id/delete_POST.schema";
// import { postGalleryPhotos, InputType as CreatePhotoInput } from "../endpoints/gallery/photos_POST.schema";
// import { postDeleteGalleryPhoto, InputType as DeletePhotoInput } from "../endpoints/gallery/photos/by-id/delete_POST.schema";

// Placeholder types until endpoint schemas are available
type CreateCategoryInput = any;
type DeleteCategoryInput = any;
type CreatePhotoInput = any;
type DeletePhotoInput = any;

// Placeholder functions until endpoints are available
const postGalleryCategories = async (data: CreateCategoryInput): Promise<any> => {
  console.warn("postGalleryCategories endpoint not implemented.");
  toast.error("This feature is not yet available.");
  return Promise.reject(new Error("Endpoint not implemented"));
};
const postDeleteGalleryCategory = async (data: DeleteCategoryInput): Promise<any> => {
  console.warn("postDeleteGalleryCategory endpoint not implemented.");
  toast.error("This feature is not yet available.");
  return Promise.reject(new Error("Endpoint not implemented"));
};
const postGalleryPhotos = async (data: CreatePhotoInput): Promise<any> => {
  console.warn("postGalleryPhotos endpoint not implemented.");
  toast.error("This feature is not yet available.");
  return Promise.reject(new Error("Endpoint not implemented"));
};
const postDeleteGalleryPhoto = async (data: DeletePhotoInput): Promise<any> => {
  console.warn("postDeleteGalleryPhoto endpoint not implemented.");
  toast.error("This feature is not yet available.");
  return Promise.reject(new Error("Endpoint not implemented"));
};

/**
 * A collection of React Query mutation hooks for managing the gallery,
 * including creating/deleting categories and photos.
 */
export const useGalleryMutations = () => {
  const queryClient = useQueryClient();

  const invalidateGallery = () => {
    console.log("Invalidating gallery query.");
    queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEY });
  };

  const useCreateGalleryCategory = () =>
    useMutation({
      mutationFn: postGalleryCategories,
      onSuccess: () => {
        toast.success("Gallery category created!");
        invalidateGallery();
      },
      onError: (error) => {
        console.error("Error creating gallery category:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        if (message !== "Endpoint not implemented") {
          toast.error(`Failed to create category: ${message}`);
        }
      },
    });

  const useDeleteGalleryCategory = () =>
    useMutation({
      mutationFn: postDeleteGalleryCategory,
      onSuccess: () => {
        toast.success("Gallery category deleted!");
        invalidateGallery();
      },
      onError: (error) => {
        console.error("Error deleting gallery category:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        if (message !== "Endpoint not implemented") {
          toast.error(`Failed to delete category: ${message}`);
        }
      },
    });

  const useCreateGalleryPhoto = () =>
    useMutation({
      mutationFn: postGalleryPhotos,
      onSuccess: () => {
        toast.success("Photo added to gallery!");
        invalidateGallery();
      },
      onError: (error) => {
        console.error("Error creating gallery photo:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        if (message !== "Endpoint not implemented") {
          toast.error(`Failed to add photo: ${message}`);
        }
      },
    });

  const useDeleteGalleryPhoto = () =>
    useMutation({
      mutationFn: postDeleteGalleryPhoto,
      onSuccess: () => {
        toast.success("Photo deleted from gallery!");
        invalidateGallery();
      },
      onError: (error) => {
        console.error("Error deleting gallery photo:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        if (message !== "Endpoint not implemented") {
          toast.error(`Failed to delete photo: ${message}`);
        }
      },
    });

  return {
    useCreateGalleryCategory,
    useDeleteGalleryCategory,
    useCreateGalleryPhoto,
    useDeleteGalleryPhoto,
  };
};