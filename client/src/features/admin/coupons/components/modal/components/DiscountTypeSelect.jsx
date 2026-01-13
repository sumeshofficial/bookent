import FormField from "./FormField";

const DiscountTypeSelect = ({ value, onChange }) => {
  return (
    <FormField label="Discount Type">
      <select
        name="discountType"
        value={value}
        onChange={onChange}
        className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="PERCENTAGE">Percentage</option>
        <option value="FLAT">Flat</option>
      </select>
    </FormField>
  );
};

export default DiscountTypeSelect;
