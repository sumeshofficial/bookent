import CouponHeader from "./components/CouponList/CouponHeader";
import CouponTable from "./components/CouponList/desktop/CouponTable";
import { CouponMobileCard } from "./components/CouponList/mobile";
import { useCoupons } from "./hooks/useCoupons";

const Coupons = () => {
  const { coupons, meta, loading } = useCoupons();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <CouponHeader />

      <div className="bg-white rounded-lg shadow">
        <CouponTable coupons={coupons} meta={meta} isLoading={loading} />
        <CouponMobileCard coupons={coupons} isLoading={loading} />
      </div>
    </div>
  );
};

export default Coupons;
