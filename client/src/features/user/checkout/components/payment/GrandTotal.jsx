const GrandTotal = ({ amount }) => {
  return (
    <div className="pt-4 border-t flex justify-between text-lg font-semibold">
      <span>Grand Total</span>
      <span>$ {amount}</span>
    </div>
  );
};

export default GrandTotal;
