import { useMutation } from "@tanstack/react-query";
import { changeUserPassword } from "../services/update.service";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changeUserPassword,
  });
};
