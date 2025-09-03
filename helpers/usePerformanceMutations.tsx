import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PERFORMANCES_QUERY_KEY } from "./usePerformances";
import { toast } from "sonner";

// NOTE: The following imports are placeholders for endpoint schemas that are not yet created.
// These would be required for the mutations to function.
// import { postPerformances, InputType as CreatePerformanceInput } from "../endpoints/performances_POST.schema";
// import { postPerformanceById, InputType as UpdatePerformanceInput } from "../endpoints/performances/by-id_POST.schema";
// import { postDeletePerformance, InputType as DeletePerformanceInput } from "../endpoints/performances/by-id/delete_POST.schema";

// Placeholder types until endpoint schemas are available
type CreatePerformanceInput = any;
type UpdatePerformanceInput = any;
type DeletePerformanceInput = any;

// Placeholder functions until endpoints are available
const postPerformances = async (data: CreatePerformanceInput): Promise<any> => {
  console.warn("postPerformances endpoint not implemented.");
  toast.error("This feature is not yet available.");
  return Promise.reject(new Error("Endpoint not implemented"));
};
const postPerformanceById = async (data: UpdatePerformanceInput): Promise<any> => {
  console.warn("postPerformanceById endpoint not implemented.");
  toast.error("This feature is not yet available.");
  return Promise.reject(new Error("Endpoint not implemented"));
};
const postDeletePerformance = async (data: DeletePerformanceInput): Promise<any> => {
  console.warn("postDeletePerformance endpoint not implemented.");
  toast.error("This feature is not yet available.");
  return Promise.reject(new Error("Endpoint not implemented"));
};


/**
 * A collection of React Query mutation hooks for creating, updating, and deleting performances.
 * These hooks handle API calls and manage cache invalidation for the performances query.
 */
export const usePerformanceMutations = () => {
  const queryClient = useQueryClient();

  const invalidatePerformances = () => {
    console.log("Invalidating performances query.");
    queryClient.invalidateQueries({ queryKey: PERFORMANCES_QUERY_KEY });
  };

  /**
   * Mutation to create a new performance.
   */
  const useCreatePerformance = () =>
    useMutation({
      mutationFn: postPerformances,
      onSuccess: () => {
        toast.success("Performance created successfully!");
        invalidatePerformances();
      },
      onError: (error) => {
        console.error("Error creating performance:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        if (message !== "Endpoint not implemented") {
          toast.error(`Failed to create performance: ${message}`);
        }
      },
    });

  /**
   * Mutation to update an existing performance.
   */
  const useUpdatePerformance = () =>
    useMutation({
      mutationFn: postPerformanceById,
      onSuccess: () => {
        toast.success("Performance updated successfully!");
        invalidatePerformances();
      },
      onError: (error) => {
        console.error("Error updating performance:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        if (message !== "Endpoint not implemented") {
          toast.error(`Failed to update performance: ${message}`);
        }
      },
    });

  /**
   * Mutation to delete a performance.
   */
  const useDeletePerformance = () =>
    useMutation({
      mutationFn: postDeletePerformance,
      onSuccess: () => {
        toast.success("Performance deleted successfully!");
        invalidatePerformances();
      },
      onError: (error) => {
        console.error("Error deleting performance:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        if (message !== "Endpoint not implemented") {
          toast.error(`Failed to delete performance: ${message}`);
        }
      },
    });

  return {
    useCreatePerformance,
    useUpdatePerformance,
    useDeletePerformance,
  };
};