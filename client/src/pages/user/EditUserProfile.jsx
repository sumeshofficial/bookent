import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { data, useNavigate } from "react-router-dom";
import { useModal } from "../../utils/constants";
import {
  updateUserProfile,
  updateUserProfileData,
} from "../../redux/userSlice";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { sendOTP } from "../../services/auth";

const EditUserProfile = () => {
  const { user } = useSelector((store) => store.user);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    defaultValues: {
      fullname: user.fullname,
      email: user.email,
    },
  });
  const { closeModal, openModal } = useModal();
  const dispatch = useDispatch();

  const sameFullname = user.fullname === watch("fullname");
  const sameEmail = user.email === watch("email");

  const onSubmit = async (data) => {
    const updatedFields = Object.keys(dirtyFields).reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {});

    if (updatedFields.email) {
      const response = await sendOTP({
        data: updatedFields,
        purpose: "edit-email",
      });
      toast.success("OTP sent successfully");
      reset();
      openModal("otp", {
        title: response,
        email: updatedFields.email,
        purpose: "edit-email",
        updatedData: { updatedFields, user },
      });
      return;
    }
    closeModal();
    dispatch(
      updateUserProfileData({
        ...updatedFields,
      })
    );
    toast.success("Profile updated successfully!");
    dispatch(updateUserProfile({ id: user._id, data: updatedFields }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl p-4 mt-10">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Edit User Profile
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              {...register("fullname", {
                required: "Full name is required",
                minLength: { value: 3, message: "Full name must be at least 3 characters" }
              })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          {errors?.fullname && (
            <span className="text-center text-red-500">
              {errors.fullname.message}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="text"
              name="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address"
                }
              })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          {errors?.email && (
            <span className="text-center text-red-500">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || (sameFullname && sameEmail)}
            className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-700 disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserProfile;
