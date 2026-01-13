const PriceRow = ({ label, value, className }) => {
  return (
    <div className={`flex justify-between ${className}`}>
      <span>{label}</span>
      <span>$ {value}</span>
    </div>
  );
};

export default PriceRow;
