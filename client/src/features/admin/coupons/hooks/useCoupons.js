import { useEffect, useState } from "react";
import { fetchCoupons } from "../services/coupon.service";

export const useCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons().then((data) => {
      setCoupons(data);
      setLoading(false);
    });
  }, []);

  const toggleStatus = (id) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c._id === id ? { ...c, isActive: !c.isActive } : c
      )
    );
  };

  const deleteCoupon = (id) => {
    setCoupons((prev) => prev.filter((c) => c._id !== id));
  };

  return { coupons, loading, toggleStatus, deleteCoupon };
};