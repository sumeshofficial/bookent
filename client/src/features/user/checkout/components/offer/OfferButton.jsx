import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useCoupon } from "../../hooks/useCoupon";
import { toast } from "react-hot-toast";

const OfferButton = ({ onCouponApplied, onCouponRemoved }) => {
  const [activeCoupon, setActiveCoupon] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    clearErrors,
    formState: { errors },
  } = useForm();

  const couponCode = useWatch({
    control,
    name: "coupon",
  });

  useEffect(() => {
    if (!couponCode) {
      clearErrors("coupon");
    }
  }, [couponCode, clearErrors]);

  const lockId = sessionStorage.getItem("lockId");

  const { data, isLoading, isError, error } = useCoupon(activeCoupon, lockId);

  const appliedCouponData = data ?? null;
  const isApplied = Boolean(appliedCouponData);

  useEffect(() => {
    const savedCoupon = sessionStorage.getItem("appliedCoupon");
    if (savedCoupon) {
      setValue("coupon", savedCoupon);
    }
  }, [setValue]);

  useEffect(() => {
    if (!appliedCouponData) return;

    onCouponApplied(appliedCouponData);
    sessionStorage.setItem("appliedCoupon", activeCoupon);
  }, [appliedCouponData, activeCoupon, onCouponApplied]);

  const onSubmit = () => {
    if (!lockId) {
      return toast.error("LockId not found");
    }

    if (!couponCode) {
      return toast.error("Coupon code is required");
    }

    setActiveCoupon(couponCode);
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    onCouponRemoved();
    sessionStorage.removeItem("appliedCoupon");
    setValue("coupon", "");
    clearErrors("coupon");
  };

  return (
    <div className="w-full rounded-lg bg-white">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              disabled={isApplied || isLoading}
              {...register("coupon", {
                required: "Coupon code is required",
                minLength: {
                  value: 3,
                  message: "Coupon code is too short",
                },
                maxLength: {
                  value: 20,
                  message: "Coupon code is too long",
                },
                pattern: {
                  value: /^[A-Z0-9]+$/,
                  message: "Only uppercase letters and numbers allowed",
                },
                setValueAs: (v) => v.trim().toUpperCase(),
              })}
              placeholder="Enter coupon code"
              className="w-full border rounded-lg px-3 py-2 pr-10 outline-none uppercase"
            />

            {isApplied && (
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600 text-lg font-semibold"
                aria-label="Remove coupon"
              >
                ×
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isApplied || isLoading}
            className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {isLoading ? "Applying..." : isApplied ? "Applied" : "Apply"}
          </button>
        </div>
      </form>

      {errors?.coupon && (
        <p className="text-red-500 text-sm mt-1">{errors.coupon.message}</p>
      )}

      {isError && couponCode && activeCoupon && (
        <p className="text-red-500 text-sm mt-1">
          {error?.response?.data?.error?.message || "Invalid coupon"}
        </p>
      )}

      {appliedCouponData && isApplied && (
        <p className="text-green-600 text-sm mt-1">
          Coupon applied! You saved ${appliedCouponData.discount?.toFixed(2)}
        </p>
      )}
    </div>
  );
};

export default OfferButton;
