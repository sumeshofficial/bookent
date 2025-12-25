import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCoupon } from "../../hooks/useCoupon";
import { toast } from "react-hot-toast";

const OfferButton = ({ onCouponApplied, onCouponRemoved }) => {
  const [isApplied, setIsApplied] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const couponCode = watch("coupon");

  useEffect(() => {
    const savedCoupon = sessionStorage.getItem("appliedCoupon");
    if (savedCoupon) {
      setValue("coupon", savedCoupon);
      setIsApplied(true);
    }
  }, [setValue]);

  const { mutate: applyCoupon, isPending, error, data } = useCoupon();

  const onSubmit = () => {
    const lockId = sessionStorage.getItem("lockId");
    if (!lockId) {
      return toast.error("LockId not found");
    }
    applyCoupon(
      { couponCode, lockId },
      {
        onSuccess: (data) => {
          if (data) {
            setIsApplied(true);
            onCouponApplied(data);
            sessionStorage.setItem("appliedCoupon", couponCode);
          }
        },
      }
    );
  };

  const handleRemoveCoupon = () => {
    setIsApplied(false);
    onCouponRemoved();
    sessionStorage.removeItem("appliedCoupon");
  };

  return (
    <div className="w-full rounded-lg bg-white">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              disabled={isApplied || isPending}
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
            disabled={isApplied || isPending}
            className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {isPending ? "Applying..." : isApplied ? "Applied" : "Apply"}
          </button>
        </div>
      </form>

      {errors?.coupon && (
        <p className="text-red-500 text-sm mt-1">{errors.coupon.message}</p>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error?.response?.data?.error?.message || "Invalid coupon"}
        </p>
      )}

      {data && isApplied && (
        <p className="text-green-600 text-sm mt-1">
          Coupon applied! You saved ${data.discount?.toFixed(2)}
        </p>
      )}
    </div>
  );
};

export default OfferButton;
