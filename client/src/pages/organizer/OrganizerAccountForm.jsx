import { useEffect, useState } from "react";
import logo from "../../assets/bookent-logo-white.png";
import { useForm } from "react-hook-form";
import { registerOrganizationAccount } from "../../services/organization";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import { addOrganizer } from "../../Redux/organizerSlice";

const OrganizarAccountForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
  });

  const dispatch = useDispatch();

  const [isError, setError] = useState();

  useEffect(() => {
    if (isSubmitting) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSubmitting]);

  const { user } = useSelector((store) => store.user);

  const onSubmit = async (data) => {
    const organizationDetails = {
      name: data.orgName,
      address: data.orgAddress,
      state: data.state,
    };
    const bankAccountDetails = {
      beneficiaryName: data.beneficiaryName,
      accountNumber: data.accountNumber,
      accountType: data.accountType,
      bankName: data.bankName,
      ifsc: data.bankIFSC,
    };

    const userId = user._id;

    try {
      const res = await registerOrganizationAccount({
        organizationDetails,
        bankAccountDetails,
        userId,
      });

      dispatch(addOrganizer(res.data));
      toast.dismiss();
      toast.success("Registration Successfully");
    } catch (error) {
      setError(error?.message || "Something went wrong");
      toast.dismiss();
      toast.error(error.message);
    }

    reset();
  };

  // Auto uppercase IFSC
  const handleIFSCChange = (e) => {
    const value = e.target.value.toUpperCase();
    setValue("bankIFSC", value, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
          <Loader className="w-16 h-16 animate-spin text-violet-600" />
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 shadow-sm">
        <div className="max-w-6xl">
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="Bookent"
              className="h-8 sm:h-12 w-auto object-contain"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Account
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Please fill in the below details so that we can setup an account for
            your organisation and give you access to our event portal.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            {/* Organisation Details */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Organisation Details
              </h3>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organisation/Individual Name
                  </label>
                  <input
                    type="text"
                    {...register("orgName", {
                      required: "Organization Name is required",
                      minLength: {
                        value: 3,
                        message: "Minimum 3 characters required",
                      },
                    })}
                    placeholder="Enter your organisation name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-4 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all duration-200"
                  />
                  {errors.orgName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.orgName.message}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organisation Address
                  </label>
                  <textarea
                    {...register("orgAddress", {
                      required: "Address is required",
                    })}
                    placeholder="Enter your organisation address"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-4 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all resize-none"
                  />
                  {errors.orgAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.orgAddress.message}
                    </p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    {...register("state", {
                      required: "State is required",
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-4 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all bg-white"
                  >
                    <option value="">Select State</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Bank Details
              </h3>

              <div className="space-y-6">
                {/* Beneficiary + Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Beneficiary Name
                    </label>
                    <input
                      type="text"
                      {...register("beneficiaryName", {
                        required: "Beneficiary Name is required",
                      })}
                      placeholder="Enter Beneficiary Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-4 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all duration-200"
                    />
                    {errors.beneficiaryName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.beneficiaryName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type
                    </label>
                    <select
                      {...register("accountType", {
                        required: "Account Type is required",
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-4 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all bg-white"
                    >
                      <option value="">Select account type</option>
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                    </select>
                    {errors.accountType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.accountType.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bank name, Account number, IFSC */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name
                    </label>
                    <select
                      {...register("bankName", {
                        required: "Bank Name is required",
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-4 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all bg-white"
                    >
                      <option value="">Select bank name</option>
                      <option value="SBI">State Bank of India</option>
                      <option value="HDFC">HDFC Bank</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="Axis">Axis Bank</option>
                    </select>
                    {errors.bankName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.bankName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      {...register("accountNumber", {
                        required: "Account Number is required",
                        pattern: {
                          value: /^[0-9]{9,18}$/,
                          message: "Account number must be 9–18 digits only",
                        },
                      })}
                      placeholder="Enter Account Number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-4 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all duration-200"
                    />
                    {errors.accountNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.accountNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank IFSC
                    </label>
                    <input
                      type="text"
                      {...register("bankIFSC", {
                        required: "IFSC Code is required",
                        pattern: {
                          value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                          message: "Invalid IFSC format (e.g., SBIN0001234)",
                        },
                      })}
                      onChange={handleIFSCChange}
                      placeholder="Enter IFSC Code"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md uppercase focus:ring-4 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all duration-200"
                    />
                    {errors.bankIFSC && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.bankIFSC.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || isError}
                className="bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition-all duration-200 focus:ring-4 focus:ring-offset-2 focus:ring-black disabled:opacity-70"
              >
                {isSubmitting ? "Submitting..." : "Proceed"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizarAccountForm;
