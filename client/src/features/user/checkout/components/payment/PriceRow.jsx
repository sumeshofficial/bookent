const PriceRow = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>$ {value}</span>
    </div>
  );
};

export default PriceRow;