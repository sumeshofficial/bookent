import logo from "../../assets/bookent-logo-white.png";

const OrganizerAccRequested = () => {
  return (
    <div className="min-h-screen bg-gray-50">
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
      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-16 md:py-24">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Account Request Submitted!
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
            Thank you for submitting your account request. Your application is
            currently under review by our admin team. We'll notify you via email
            once your account has been approved.
          </p>

          {/* Status Card */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold text-yellow-800">
                Pending Approval
              </span>
            </div>
            <p className="text-sm text-yellow-700">
              Estimated review time: 24-48 hours
            </p>
          </div>

          {/* Info Section */}
          <div className="text-left bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-3">
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                <span>
                  Our admin team will review your submitted information
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                <span>You'll receive an email notification once approved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                <span>
                  Access to the organizer dashboard will be granted upon
                  approval
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerAccRequested;
