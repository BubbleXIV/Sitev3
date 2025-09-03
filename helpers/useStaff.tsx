import { useQuery } from "@tanstack/react-query";
import { getStaff } from "../endpoints/staff_GET.schema";

export const STAFF_QUERY_KEY = ["staff", "list"] as const;

export const useStaff = () => {
  return useQuery({
    queryKey: STAFF_QUERY_KEY,
    queryFn: () => getStaff(),
  });
};