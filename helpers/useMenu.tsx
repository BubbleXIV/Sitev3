import { useQuery } from "@tanstack/react-query";
import { getMenu } from "../endpoints/menu_GET.schema";

export const MENU_QUERY_KEY = ["menu", "list"] as const;

export const useMenu = () => {
  return useQuery({
    queryKey: MENU_QUERY_KEY,
    queryFn: () => getMenu(),
  });
};