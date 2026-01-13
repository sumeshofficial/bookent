import { useSelector } from "react-redux";
import FormInput from "./FormInput";
import { useModal } from "../../../../../utils/constants";

const ProfileForm = ({
  form,
  onSubmit,
  sameEmail,
  sameFullname,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    formState,
  } = form;
  const { user } = useSelector((store) => store.user);
  const { closeModal } = useModal();

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, dirtyFields))}
      className="space-y-4"
    >
      <FormInput
        label="Full Name"
        name="fullname"
        register={register}
        rules={{
          required: "Full name is required",
          minLength: { value: 3, message: "At least 3 characters" },
        }}
        error={errors.fullname}
      />

      {user?.authProvider === "email" && (
        <FormInput
          label="Email"
          name="email"
          register={register}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          }}
          error={errors.email}
        />
      )}

      <div className="pt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => closeModal()}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            formState.isSubmitting ||
            isSubmitting ||
            (sameEmail && sameFullname)
          }
          className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-700 disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
