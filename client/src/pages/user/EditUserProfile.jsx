import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { data, useNavigate } from "react-router-dom";
import { useModal } from "../../utils/constants";
import { updateUserProfile } from "../../Redux/userSlice";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const EditUserProfile = () => {
  const { user } = useSelector((store) => store.user);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullname: user.fullname,
    },
  });
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const sameFullname = user.fullname === watch("fullname");

  const onSubmit = async (data) => {
    dispatch(updateUserProfile({ id: user._id, data }));
    closeModal();
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-10">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Edit User Profile
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {true && (
          <span className="text-center text-red-500">
            {errors?.fullname?.message}
          </span>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullname"
            {...register("fullname", {
              required: true,
            })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
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
            disabled={isSubmitting || sameFullname}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserProfile;
