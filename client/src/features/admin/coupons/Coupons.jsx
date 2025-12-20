import CouponHeader from "./components/CouponHeader";
import CouponTable from "./components/CouponTable";
import CouponMobileCard from "./components/CouponMobileCard";
import { useCoupons } from "./hooks/useCoupons";

const Coupons = () => {
  const { coupons, toggleStatus, deleteCoupon } = useCoupons();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <CouponHeader />

      <div className="bg-white rounded-lg shadow">
        <CouponTable
          coupons={coupons}
          onToggle={toggleStatus}
          onDelete={deleteCoupon}
        />
        <CouponMobileCard
          coupons={coupons}
          onToggle={toggleStatus}
          onDelete={deleteCoupon}
        />
      </div>
    </div>
  );
};

export default Coupons;