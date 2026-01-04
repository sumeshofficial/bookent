import { useForm } from "react-hook-form";
import { useEffect } from "react";

import ModalFooter from "./ModalFooter";
import CouponFormHeader from "./CouponFormHeader";
import CouponDiscountSection from "./CouponDiscountSection";
import CouponLimitsSection from "./CouponLimitsSection";
import CouponDateSection from "./CouponDateSection";
import CouponStatusSection from "./CouponStatusSection";

const CouponForm = ({ handleSubmit, coupon, onClose, isPending }) => {
  const {
    register,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    reset,
    getValues,
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

  useEffect(() => {
    if (coupon) {
      reset({
        ...coupon,
        startDate: coupon.startDate?.split("T")[0] || "",
        expiryDate: coupon.expiryDate?.split("T")[0] || "",
      });
    }
  }, [coupon, reset]);

  const discountType = watch("discountType");
  const isActive = watch("isActive");

  return (
    <form
      onSubmit={handleFormSubmit(handleSubmit)}
      className="px-6 pb-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      <CouponFormHeader coupon={coupon} />

      <CouponDiscountSection
        register={register}
        errors={errors}
        discountType={discountType}
        setValue={setValue}
      />

      <CouponLimitsSection register={register} errors={errors} />

      <CouponDateSection register={register} errors={errors} getValues={getValues} />

      <CouponStatusSection isActive={isActive} setValue={setValue} />

      <ModalFooter coupon={coupon} onClose={onClose} isPending={isPending} />
    </form>
  );
};

export default CouponForm;