import { useState, useEffect } from "react";
import {
  getState,
  sendOtpEmailVerification,
} from "../../services/organization";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  updateOrganizerProfile,
  updateOrganizerProfileData,
} from "../../redux/organizerSlice";
import toast from "react-hot-toast";
import CropImageProfile from "../../components/user/CropImageProfile";
import {
  generateImageUrl,
  generateUploadUrl,
  uploadFile,
} from "../../services/s3";
import { onResend, verifyOtp } from "../../services/auth";

const OrganizerProfilePage = () => {
  const { organizer } = useSelector((store) => store.organizer);
  const dispatch = useDispatch();
  const [stateList, setStateList] = useState([]);

  const [activeTab, setActiveTab] = useState("profile");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);

  const imageUpdate = async (image) => {
    const previewUrl = URL.createObjectURL(image);

    dispatch(
      updateOrganizerProfileData({
        profileImage: previewUrl,
      })
    );

    toast.success("Profile image updated");

    try {
      const { signedUrl, key } = await generateUploadUrl({
        fileName: `orgProfile-${organizer._id}`,
        contentType: image.type,
        folderName: "organizer/profile",
      });

      await uploadFile({ file: image, contentType: image.type, signedUrl });
      await generateImageUrl(key);

      dispatch(
        updateOrganizerProfile({
          id: organizer._id,
          data: { profileImage: key },
        })
      );
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({
    defaultValues: {
      fullname: organizer.fullname,
      email: organizer.email,
      name: organizer.organizationDetails.name,
      address: organizer.organizationDetails.address,
      state: organizer.organizationDetails.state,
      beneficiaryName: organizer.bankAccountDetails.beneficiaryName,
      accountNumber: organizer.bankAccountDetails.accountNumber,
      accountType: organizer.bankAccountDetails.accountType,
      bankName: organizer.bankAccountDetails.bankName,
      ifsc: organizer.bankAccountDetails.ifsc,
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      if (value?.email === organizer.email) {
        setIsEmailVerified(true);
        setEmailOtpSent(false);
      } else {
        setIsEmailVerified(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, organizer.email]);

  useEffect(() => {
    let interval = null;
    if (emailOtpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emailOtpSent, resendTimer]);

  useEffect(() => {
    reset({
      fullname: organizer.fullname,
      email: organizer.email,
      name: organizer.organizationDetails.name,
      address: organizer.organizationDetails.address,
      state: organizer.organizationDetails.state,
      beneficiaryName: organizer.bankAccountDetails.beneficiaryName,
      accountNumber: organizer.bankAccountDetails.accountNumber,
      accountType: organizer.bankAccountDetails.accountType,
      bankName: organizer.bankAccountDetails.bankName,
      ifsc: organizer.bankAccountDetails.ifsc,
    });
  }, [organizer, reset]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const data = await getState();
        setStateList(data);
      } catch (error) {
        console.error("Error fetching states:", error);
        toast.error("Failed to load states");
      }
    };
    fetchStates();
  }, []);

  const buildUpdatedPayload = (dirtyFields, data) => {
    const updated = {};

    if (dirtyFields.fullname) updated.fullname = data.fullname;
    if (dirtyFields.email) updated.email = data.email;

    if (dirtyFields.name || dirtyFields.address || dirtyFields.state) {
      updated.organizationDetails = {};
      if (dirtyFields.name) updated.organizationDetails.name = data.name;
      if (dirtyFields.address)
        updated.organizationDetails.address = data.address;
      if (dirtyFields.state) updated.organizationDetails.state = data.state;
    }

    if (
      dirtyFields.beneficiaryName ||
      dirtyFields.accountNumber ||
      dirtyFields.accountType ||
      dirtyFields.bankName ||
      dirtyFields.ifsc
    ) {
      updated.bankAccountDetails = {};
      if (dirtyFields.beneficiaryName)
        updated.bankAccountDetails.beneficiaryName = data.beneficiaryName;
      if (dirtyFields.accountNumber)
        updated.bankAccountDetails.accountNumber = data.accountNumber;
      if (dirtyFields.accountType)
        updated.bankAccountDetails.accountType = data.accountType;
      if (dirtyFields.bankName)
        updated.bankAccountDetails.bankName = data.bankName;
      if (dirtyFields.ifsc) updated.bankAccountDetails.ifsc = data.ifsc;
    }

    return updated;
  };

  const handleSendOtp = async (email, purpose = "email-verify") => {
    try {
      toast.dismiss();
      toast.success("OTP sent");
      setEmailOtpSent(true);
      setResendTimer(30);
      await sendOtpEmailVerification(email, purpose);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleResendOtp = async (email, purpose = "email-verify") => {
    try {
      toast.dismiss();
      toast.success("OTP resent");
      setResendTimer(30);
      await onResend({ email, purpose });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleOtpVerification = async (
    email,
    otp,
    purpose = "email-verify"
  ) => {
    try {
      const data = {
        email,
        otp,
        purpose,
      };
      await verifyOtp(data);
      setIsEmailVerified(true);
      setEmailOtpSent(false);
      toast.dismiss();
      toast.success("Email verified successfully");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const onSubmit = (formdata) => {
    const updatedData = buildUpdatedPayload(dirtyFields, formdata);
    dispatch(
      updateOrganizerProfileData({
        ...updatedData,
      })
    );
    toast.dismiss();
    toast.success("Profile updated successfully!");
    dispatch(updateOrganizerProfile({ id: organizer._id, data: updatedData }));
  };

  return (
    <div className="min-h-screen flex justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-10 max-w-5xl w-full">
        <div className="flex items-center gap-4 mb-6">
          <CropImageProfile
            imageUpdate={imageUpdate}
            label="Change Profile"
            user={organizer}
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {organizer.fullname}
            </h2>
            <p className="text-gray-500 break-all line-clamp-1">
              {organizer.email}
            </p>
          </div>
        </div>

        <div className="flex border-b pb-2 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "profile"
                ? "border-b-2 border-black text-black"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Organizer Profile
          </button>

          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "organization"
                ? "border-b-2 border-black text-black"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("organization")}
          >
            Organization Details
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="transition-all duration-300">
            {activeTab === "profile" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Organizer Information
                </h3>

                <div>
                  <label className="text-sm text-gray-600">Full Name</label>
                  <input
                    type="text"
                    {...register("fullname", {
                      required: "Full name is required",
                      minLength: {
                        value: 3,
                        message: "Minimum 3 characters required",
                      },
                    })}
                    className="w-full mt-1 px-4 py-3 bg-gray-100 rounded-lg border border-gray-300 break-all overflow-hidden"
                  />
                  {errors.fullname && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullname.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    type="text"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format",
                      },
                    })}
                    className="w-full mt-1 px-4 py-3 bg-gray-100 rounded-lg border border-gray-300 break-all overflow-hidden"
                  />
                  {!emailOtpSent && !isEmailVerified && (
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSendOtp(watch("email"))}
                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                      >
                        Send OTP
                      </button>
                    </div>
                  )}

                  {emailOtpSent && !isEmailVerified && (
                    <div className="mt-3 space-y-2">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-300"
                      />
                      <div className="flex justify-end items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleOtpVerification(watch("email"), otp)
                          }
                          className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
                        >
                          Verify
                        </button>

                        <button
                          type="button"
                          disabled={resendTimer > 0}
                          onClick={() => handleResendOtp(watch("email"))}
                          className={`px-4 py-2 font-medium rounded-lg shadow transition ${
                            resendTimer > 0
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {resendTimer > 0
                            ? `Resend in ${resendTimer}s`
                            : "Resend OTP"}
                        </button>
                      </div>
                    </div>
                  )}
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "organization" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Organization Details
                </h3>

                <div>
                  <label className="text-sm text-gray-600">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "Organization name is required",
                      minLength: {
                        value: 3,
                        message: "Minimum 3 characters required",
                      },
                    })}
                    className="w-full mt-1 px-4 py-3 bg-gray-100 rounded-lg border"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Address</label>
                  <input
                    type="text"
                    {...register("address", {
                      required: "Address is required",
                      minLength: { value: 5, message: "Address too short" },
                    })}
                    className="w-full mt-1 px-4 py-3 bg-gray-100 rounded-lg border"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">State</label>
                  <select
                    {...register("state", {
                      required: "State is required",
                    })}
                    className="w-full mt-1 px-4 py-3 bg-gray-100 rounded-lg border"
                  >
                    <option value="">Select State</option>
                    {stateList.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-700 mt-6">
                  Bank Account Details
                </h3>

                <div>
                  <label className="text-sm text-gray-600">
                    Beneficiary Name
                  </label>
                  <input
                    type="text"
                    {...register("beneficiaryName", {
                      required: "Beneficiary name is required",
                      pattern: {
                        value: /^[A-Za-z ]+$/,
                        message: "Only letters and spaces allowed",
                      },
                    })}
                    className="w-full mt-1 px-4 py-3 bg-gray-100 rounded-lg border"
                  />
                  {errors.beneficiaryName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.beneficiaryName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Account Number
                  </label>
                  <input
                    type="text"
                    {...register("accountNumber", {
                      required: "Account number is required",
                      pattern: {
                        value: /^[0-9]{9,18}$/,
                        message: "Account number must be 9–18 digits",
                      },
                    })}
                    className="w-full mt-1 px-4 py-3 bg-gray-100 rounded-lg border"
                  />
                  {errors.accountNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.accountNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Account Type</label>
                  <select
                    {...register("accountType", {
                      required: "Account type is required",
                    })}
                    className="w-full mt-1 px-4 py-3 bg-gray-100 rounded-lg border"
                  >
                    <option value="Savings">Savings</option>
                    <option value="Current">Current</option>
                  </select>
                  {errors.accountType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.accountType.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Bank Name</label>
                  <input
                    type="text"
                    {...register("bankName", {
                      required: "Bank name is required",
                    })}
                    className="w-full mt-1 px-4 py-3 bg-gray-100 rounded-lg border"
                  />
                  {errors.bankName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bankName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">IFSC Code</label>
                  <input
                    type="text"
                    {...register("ifsc", {
                      required: "IFSC code is required",
                      pattern: {
                        value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                        message: "Invalid IFSC format (e.g., SBIN0001234)",
                      },
                    })}
                    className="w-full mt-1 px-4 py-3 bg-gray-100 rounded-lg border"
                  />
                  {errors.ifsc && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.ifsc.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {(activeTab === "organization" || activeTab === "profile") && (
              <button
                disabled={!isDirty || !isEmailVerified}
                className={`mt-8 w-40 py-3 font-semibold rounded-lg transition ${
                  isDirty && isEmailVerified
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                SAVE
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizerProfilePage;
