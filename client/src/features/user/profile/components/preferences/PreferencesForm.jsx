import PropTypes from "prop-types";

const PreferencesForm = ({
  form,
  isChanged,
  onSubmit,
  options,
  externalSaving,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const loading = isSubmitting || externalSaving;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-2xl shadow-sm p-6 space-y-6"
    >
      <h2 className="text-xl font-bold text-gray-800">
        Select Your Preferences
      </h2>

      {Object.keys(options).map((key) => (
        <div key={key}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {options[key].label}
          </label>

          <select
            {...register(key, {
              required: `${options[key].label} is required`,
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       focus:border-indigo-500 appearance-none bg-white"
          >
            {options[key].values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          {errors[key] && (
            <p className="text-sm text-red-500 mt-1">{errors[key].message}</p>
          )}
        </div>
      ))}

      {isChanged && (
        <div className="mt-8 justify-end flex">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-black hover:bg-gray-700
                       text-white font-semibold rounded-lg transition duration-200
                       disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </form>
  );
};

PreferencesForm.propTypes = {
  form: PropTypes.shape({
    register: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    formState: PropTypes.shape({
      errors: PropTypes.object,
      isSubmitting: PropTypes.bool,
    }).isRequired,
  }).isRequired,
  isChanged: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  options: PropTypes.objectOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  externalSaving: PropTypes.bool,
};

export default PreferencesForm;
