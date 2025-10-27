import logo from "../../assets/bookent-logo-white.png";

const OrganizerAccRejected = () => {
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
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M12 5.5a6.5 6.5 0 106.5 6.5A6.508 6.508 0 0012 5.5zm0 0v.01"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Account Request Rejected
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
            We regret to inform you that your organizer account request has been
            rejected by our admin team. This could be due to missing or invalid
            information in your submission.
          </p>

          {/* Status Card */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold text-red-800">
                Request Rejected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerAccRejected;
