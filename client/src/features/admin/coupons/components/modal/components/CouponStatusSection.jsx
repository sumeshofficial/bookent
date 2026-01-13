import ActiveToggle from "./ActiveToggle";

const CouponStatusSection = ({ isActive, setValue }) => {
  return (
    <ActiveToggle
      checked={isActive}
      onChange={(e) => setValue("isActive", e.target.checked)}
    />
  );
};

export default CouponStatusSection;
