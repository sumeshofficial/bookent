import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { toggleUserStatus } from "../services/users.service";

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: () => {
      toast.dismiss();
      toast.success("User status updated");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error?.message || "Failed to update user status");
    },
  });

  const toggleStatus = (userId, currentStatus) => {
    mutation.mutate({
      userId,
      newStatus: currentStatus === "active" ? "blocked" : "active",
    });
  };

  return {
    toggleStatus,
    isLoading: mutation.isPending,
  };
};
