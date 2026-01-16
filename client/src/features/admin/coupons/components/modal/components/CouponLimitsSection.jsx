import InputField from "./InputField";
import FormField from "./FormField";
import PropTypes from "prop-types";

const CouponLimitsSection = ({ register, errors }) => {
  return (
    <>
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
          placeholder="E.g. 15"
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
    </>
  );
};

CouponLimitsSection.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

CouponLimitsSection.defaultProps = {
  errors: {},
};

export default CouponLimitsSection;
