import DateField from "./DateField";

const CouponDateSection = ({ register, errors }) => {
  return (
    <>
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
    </>
  );
};

export default CouponDateSection;