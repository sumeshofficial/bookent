import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserProfile,
  updateUserProfileData,
} from "../../../../app/userSlice";
import { sendOTP } from "../../../../services/auth";
import toast from "react-hot-toast";
import { useModal } from "../../../../utils/constants";

const useEditProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const { openModal, closeModal } = useModal();

  const form = useForm({
    defaultValues: {
      fullname: user.fullname,
      email: user.email,
    },
  });

  const { reset, control } = form;
  const fullname = useWatch({
    control,
    name: "fullname",
  });

  const email = useWatch({
    control,
    name: "email",
  });
  const sameFullname = user.fullname === fullname;
  const sameEmail = user.email === email;

  const submitHandler = async (data, dirtyFields) => {
    const updatedFields = Object.keys(dirtyFields).reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {});

    if (updatedFields.email) {
      const response = await sendOTP({
        data: updatedFields,
        purpose: "edit-email",
        oldEmail: user.email,
      });

      toast.success("OTP sent successfully");

      openModal("otp", {
        title: response,
        email: updatedFields.email,
        purpose: "edit-email",
        updatedData: { updatedFields, user },
      });

      reset();
      return;
    }

    closeModal();

    dispatch(updateUserProfileData(updatedFields));
    toast.success("Profile updated successfully!");

    dispatch(updateUserProfile({ id: user._id, data: updatedFields }));
  };

  return {
    form,
    sameEmail,
    sameFullname,
    submitHandler,
  };
};

export default useEditProfile;
