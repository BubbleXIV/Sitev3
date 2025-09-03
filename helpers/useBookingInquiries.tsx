import { useQuery } from "@tanstack/react-query";
import { getBookingInquiries } from "../endpoints/booking-inquiries_GET.schema";

export const BOOKING_INQUIRIES_QUERY_KEY = ["bookingInquiries", "list"] as const;

/**
 * A React Query hook to fetch the list of all booking inquiries.
 * This hook is intended for admin use only.
 */
export const useBookingInquiries = () => {
  return useQuery({
    queryKey: BOOKING_INQUIRIES_QUERY_KEY,
    queryFn: () => getBookingInquiries(),
  });
};