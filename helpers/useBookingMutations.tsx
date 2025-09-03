import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BOOKING_INQUIRIES_QUERY_KEY } from "./useBookingInquiries";
import { toast } from "sonner";

// NOTE: The following imports are placeholders for endpoint schemas that are not yet created.
// import { postBookingInquiries, InputType as SubmitInquiryInput } from "../endpoints/booking-inquiries_POST.schema";
// import { postBookingInquiryById, InputType as UpdateInquiryInput } from "../endpoints/booking-inquiries/by-id_POST.schema";

// Placeholder types until endpoint schemas are available
type SubmitInquiryInput = any;
type UpdateInquiryInput = any;

// Placeholder functions until endpoints are available
const postBookingInquiries = async (data: SubmitInquiryInput): Promise<any> => {
  console.warn("postBookingInquiries endpoint not implemented.");
  toast.error("This feature is not yet available.");
  return Promise.reject(new Error("Endpoint not implemented"));
};
const postBookingInquiryById = async (data: UpdateInquiryInput): Promise<any> => {
  console.warn("postBookingInquiryById endpoint not implemented.");
  toast.error("This feature is not yet available.");
  return Promise.reject(new Error("Endpoint not implemented"));
};

/**
 * A collection of React Query mutation hooks for submitting and updating booking inquiries.
 */
export const useBookingMutations = () => {
  const queryClient = useQueryClient();

  const invalidateInquiries = () => {
    console.log("Invalidating booking inquiries query.");
    queryClient.invalidateQueries({ queryKey: BOOKING_INQUIRIES_QUERY_KEY });
  };

  /**
   * Mutation for public users to submit a new booking inquiry.
   */
  const useSubmitBookingInquiry = () =>
    useMutation({
      mutationFn: postBookingInquiries,
      onSuccess: () => {
        toast.success("Your inquiry has been submitted successfully!");
        // No invalidation needed on the public side.
      },
      onError: (error) => {
        console.error("Error submitting booking inquiry:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        if (message !== "Endpoint not implemented") {
          toast.error(`Failed to submit inquiry: ${message}`);
        }
      },
    });

  /**
   * Mutation for admins to update an existing booking inquiry (e.g., change status, add notes).
   */
  const useUpdateBookingInquiry = () =>
    useMutation({
      mutationFn: postBookingInquiryById,
      onSuccess: () => {
        toast.success("Booking inquiry updated successfully!");
        invalidateInquiries();
      },
      onError: (error) => {
        console.error("Error updating booking inquiry:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        if (message !== "Endpoint not implemented") {
          toast.error(`Failed to update inquiry: ${message}`);
        }
      },
    });

  return {
    useSubmitBookingInquiry,
    useUpdateBookingInquiry,
  };
};