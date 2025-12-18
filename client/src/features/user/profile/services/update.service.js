import { api } from "../../../../services/api/apiSetup";

export const changeUserPassword = async ({currentPassword, newPassword}) => {
  const { data } = await api.patch("/user/account/change/password", {
    currentPassword,
    newPassword,
  });

  return data;
};
