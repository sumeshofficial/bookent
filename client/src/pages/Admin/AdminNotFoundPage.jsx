import { Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import logo from '../../assets/bookent-logo-black.png'

const AdminNotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="Bookent"
              className="h-15 sm:h-18 w-auto object-contain"
            />
          </div>
        </div>

        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[180px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 leading-none select-none">
            404
          </div>

          {/* Floating elements */}
          <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
            <div className="w-16 h-16 bg-blue-100 rounded-full opacity-50"></div>
          </div>
          <div className="absolute top-1/3 right-1/4 transform translate-x-1/2 -translate-y-1/2 animate-pulse">
            <div className="w-20 h-20 bg-purple-100 rounded-full opacity-50"></div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The admin page you're looking for doesn't exist or may have been
          moved. Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>

          <Link
            to={"/admin/dashboard"}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-medium hover:border-blue-500 hover:text-blue-600 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            Dashboard Home
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Quick Access</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to={"/admin/dashboard"}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to={"/admin/users"}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              Users
            </Link>
            <Link
              to={"/admin/events"}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              Events
            </Link>
            <Link
              to={"/admin/orders"}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              Orders
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
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
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminNotFoundPage;
