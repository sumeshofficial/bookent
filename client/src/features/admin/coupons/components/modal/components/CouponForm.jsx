import { useForm } from "react-hook-form";
import ActiveToggle from "./ActiveToggle";
import DateField from "./DateField";
import DiscountTypeSelect from "./DiscountTypeSelect";
import FormField from "./FormField";
import InputField from "./InputField";
import ModalFooter from "./ModalFooter";

const CouponForm = ({ handleSubmit, editingId, onClose, isPending }) => {
  const {
    register,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      isActive: true,
      discountType: "PERCENTAGE",
      perUserLimit: 1,
    },
  });

  const discountType = watch("discountType");
  const isActive = watch("isActive");

  return (
    <form
      onSubmit={handleFormSubmit(handleSubmit)}
      className="px-6 pb-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      <h2 className="md:col-span-2 text-lg font-semibold text-gray-800 border-b pb-3">
        {editingId ? "Edit Coupon" : "Create New Coupon"}
      </h2>

      <FormField label="Coupon Code">
        <InputField
          register={register}
          rule={{ required: "Coupon code is required" }}
          name="code"
          placeholder="E.g. SAVE20"
          className="uppercase"
          errors={errors}
        />
      </FormField>

      <FormField label="Description">
        <InputField
          register={register}
          rule={{ required: "Coupon Description is required" }}
          name="description"
          placeholder="Description"
          errors={errors}
        />
      </FormField>

      <DiscountTypeSelect
        value={discountType}
        onChange={(e) =>
          setValue("discountType", e.target.value, {
            shouldValidate: true,
          })
        }
      />

      <FormField label="Discount Value">
        <InputField
          type="number"
          register={register}
          rule={{
            valueAsNumber: true,
            required: "Discount value is required",
            min: { value: 0, message: "Must be positive" },
          }}
          name="discountValue"
          placeholder="E.g. 20"
          errors={errors}
        />
      </FormField>

      {discountType === "PERCENTAGE" && (
        <FormField label="Max Discount Amount">
          <InputField
            type="number"
            register={register}
            rule={{
              valueAsNumber: true,
              required: "Max Discount Amount is required",
              min: { value: 0, message: "Must be positive" },
            }}
            name="maxDiscountAmount"
            placeholder="E.g. 500"
            errors={errors}
          />
        </FormField>
      )}

      <FormField label="Minimum Order Amount">
        <InputField
          type="number"
          register={register}
          rule={{
            valueAsNumber: true,
            required: "Minimum Order Amount is required",
            min: { value: 0, message: "Must be positive" },
          }}
          name="minOrderAmount"
          placeholder="E.g. 1000"
          errors={errors}
        />
      </FormField>

      <FormField label="Usage Limit">
        <InputField
          type="number"
          register={register}
          rule={{
            valueAsNumber: true,
            required: "Usage Limit is required",
            min: { value: 0, message: "Must be positive" },
          }}
          name="usageLimit"
          placeholder="E.g. 100"
          errors={errors}
        />
      </FormField>

      <FormField label="Per User Usage Limit">
        <InputField
          type="number"
          register={register}
          rule={{
            valueAsNumber: true,
            required: "Per user limit is required",
            min: { value: 1, message: "Must be at least 1" },
          }}
          name="perUserLimit"
          placeholder="E.g. 1"
          errors={errors}
        />
      </FormField>

      <DateField
        label="Start Date"
        {...register("startDate", { required: "Start date is required" })}
        error={errors.startDate?.message}
      />

      <DateField
        label="Expiry Date"
        {...register("expiryDate", { required: "Expiry date is required" })}
        error={errors.expiryDate?.message}
      />

      <ActiveToggle
        checked={isActive}
        onChange={(e) => setValue("isActive", e.target.checked)}
      />

      <ModalFooter
        editingId={editingId}
        onClose={onClose}
        isPending={isPending}
      />
    </form>
  );
};

export default CouponForm;
