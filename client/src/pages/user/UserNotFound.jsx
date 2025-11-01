import { Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/bookent-logo-black.png";

const UserNotFoundPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center">
        <div className="flex items-center justify-center gap-2 mb-10">
          <img
            src={logo}
            alt="Bookent"
            className="h-14 w-auto object-contain drop-shadow-sm"
          />
        </div>

        <div className="relative mb-6">
          <div className="text-[150px] font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-purple-600  leading-none select-none">
            404
          </div>

          <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
            <div className="w-14 h-14 bg-blue-100 rounded-full opacity-40"></div>
          </div>
          <div className="absolute top-1/3 right-1/4 transform translate-x-1/2 -translate-y-1/2 animate-pulse">
            <div className="w-16 h-16 bg-indigo-100 rounded-full opacity-40"></div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you’re looking for doesn’t exist or might have been
          moved. Don’t worry, let’s get you back home.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>

          <Link
            to={"/"}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-medium hover:border-blue-500 hover:text-blue-600 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            Home Page
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 text-sm text-gray-500">
          <p>Bookent © {new Date().getFullYear()} — All rights reserved.</p>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        .animate-bounce {
          animation: bounce 3s infinite;
        }

        .animate-pulse {
          animation: pulse 2.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default UserNotFoundPage;
