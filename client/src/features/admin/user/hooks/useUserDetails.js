import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchUserDetails } from "../services/user.service";

export const useUserDetails = (userId) => {
  return useQuery({
    queryKey: ["admin-user", userId],
    queryFn: () => fetchUserDetails(userId),
    onError: (error) => toast.error(error.message),
  });
};