import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { toggleUserStatus } from "../services/users.service";
import { USERS_QUERY_KEY } from "../constants/users.constants";

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: toggleUserStatus,

    onMutate: async ({ userId, newStatus }) => {
      await queryClient.cancelQueries({
        queryKey: [USERS_QUERY_KEY],
      });

      const previousQueries = queryClient.getQueriesData({
        queryKey: [USERS_QUERY_KEY],
      });

      queryClient.setQueriesData(
        { queryKey: [USERS_QUERY_KEY], exact: false },
        (oldData) => {
          if (!oldData?.users) return oldData;

          return {
            ...oldData,
            users: oldData.users.map((user) =>
              user._id === userId ? { ...user, status: newStatus } : user
            ),
          };
        }
      );

      return { previousQueries };
    },

    onSuccess: () => {
      toast.dismiss();
      toast.success("User status updated");
    },

    onError: (error, _variables, context) => {
      toast.dismiss();
      toast.error(error?.message || "Failed to update user status");

      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
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
