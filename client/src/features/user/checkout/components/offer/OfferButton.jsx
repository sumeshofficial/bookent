const OfferButton = () => {
  return (
    <div className="w-full rounded-lg bg-white">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter coupon code"
          className="flex-1 border rounded-lg px-3 py-2 outline-none"
        />
        <button className="bg-black text-white px-4 py-2 rounded-lg">
          Apply
        </button>
      </div>

    </div>
  );
};

export default OfferButton;