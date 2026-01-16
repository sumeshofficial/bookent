import DiscountTypeSelect from "./DiscountTypeSelect";
import FormField from "./FormField";
import InputField from "./InputField";
import PropTypes from "prop-types";

const CouponDiscountSection = ({
  register,
  errors,
  discountType,
  setValue,
}) => {
  return (
    <>
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
          placeholder="E.g. 2"
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
            placeholder="E.g. 5"
            errors={errors}
          />
        </FormField>
      )}
    </>
  );
};

CouponDiscountSection.propTypes = {
  register: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  discountType: PropTypes.oneOf(["PERCENTAGE", "FLAT"]).isRequired,
  errors: PropTypes.object.isRequired,
};

export default CouponDiscountSection;
