import PropTypes from "prop-types";
import DateField from "./DateField";

const CouponDateSection = ({ register, errors, getValues }) => {
  return (
    <>
      <DateField
        label="Start Date"
        {...register("startDate", { required: "Start date is required" })}
        error={errors.startDate?.message}
      />

      <DateField
        label="Expiry Date"
        {...register("expiryDate", {
          required: "Expiry date is required",
          validate: (value) => {
            const startDate = getValues("startDate");
            if (!startDate) return true;

            return (
              new Date(value) >= new Date(startDate) ||
              "Expiry date must be same as or after start date"
            );
          },
        })}
        error={errors.expiryDate?.message}
      />
    </>
  );
};

CouponDateSection.propTypes = {
  register: PropTypes.func.isRequired,
  getValues: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    startDate: PropTypes.object,
    expiryDate: PropTypes.object,
  }).isRequired,
};

export default CouponDateSection;
