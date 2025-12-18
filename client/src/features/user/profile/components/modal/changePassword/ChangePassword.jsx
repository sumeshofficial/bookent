import ModalCloseButton from "./components/ModalCloseButton";
import FormActions from "./components/FormActions";
import FormInput from "./components/FormInput";
import { useChangePassword } from "../../../hooks/useChangePassword";
import { useForm } from "react-hook-form";
import { useChangePasswordLogic } from "../../../hooks/useChanegPasswordLogic";

const ChangePassword = ({ onClose }) => {
  const { mutate, isPending } = useChangePassword();
  const onSubmit = useChangePasswordLogic(mutate, onClose);
  const {
    register,
    watch,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({ mode: "onTouched" });

  return (
    <div className="relative p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalCloseButton onClose={onClose} />

        <h2 className="text-lg font-semibold mb-6 text-center">
          Change Password
        </h2>

        <div className="space-y-4">
          <FormInput
            name="currentPassword"
            label="Current Password"
            type="password"
            register={register}
            error={errors.currentPassword?.message}
            validation={{
              required: "Current password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
          />

          <FormInput
            name="newPassword"
            label="New Password"
            type="password"
            register={register}
            error={errors.newPassword?.message}
            validation={{
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
          />

          <FormInput
            name="confirmNewPassword"
            label="Confirm New Password"
            type="password"
            register={register}
            error={errors.confirmNewPassword?.message}
            validation={{
              required: "Please confirm your new password",
              validate: (value) =>
                value === watch("newPassword") || "Passwords do not match",
            }}
          />
        </div>

        <FormActions
          isValid={isValid}
          isPending={isPending}
          onCancel={onClose}
        />
      </form>
    </div>
  );
};

export default ChangePassword;
