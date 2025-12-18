import toast from "react-hot-toast";

export const useChangePasswordLogic = (mutate, onClose) => {
  const onSubmit = (data) => {
    mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password updated successfully");
          onClose();
        },
        onError: (err) => {
          toast.error(
            err.response?.data?.error?.message || "Failed to change password"
          );
        },
      }
    );
  };

  return onSubmit;
};
