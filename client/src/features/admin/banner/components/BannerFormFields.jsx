const BannerFormFields = ({ register, errors, disabled }) => (
  <>
    <input
      className="border w-full mb-2 p-2 disabled:opacity-60"
      placeholder="Title"
      disabled={disabled}
      {...register("title", {
        required: "Title is required",
        maxLength: 100,
      })}
    />
    {errors.title && (
      <p className="text-red-500 text-xs mb-2">{errors.title.message}</p>
    )}

    <label className="flex items-center gap-2 mb-3">
      <input type="checkbox" {...register("isActive")} />
      <span>Active</span>
    </label>
  </>
);

export default BannerFormFields;