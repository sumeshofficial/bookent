const FormInput = ({ label, error, register, name, type = "text", rules }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-600">{label}</label>

      <input
        type={type}
        {...register(name, rules)}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {error && <span className="text-red-500">{error.message}</span>}
    </div>
  );
};

export default FormInput;
