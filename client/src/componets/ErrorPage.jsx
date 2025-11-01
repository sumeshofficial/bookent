import { useRouteError, Link } from "react-router-dom";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

const ErrorPage = () => {
  const error = useRouteError();

  const errorTitle =
    error?.statusText || error?.message || "Something went wrong.";
  const errorCode = error?.status || "500";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <AlertTriangle className="text-red-500 w-16 h-16 mb-4" />
        <h1 className="text-4xl font-bold mb-2 text-red-400">Oops!</h1>
        <p className="text-lg text-gray-300 mb-6 max-w-md">
          {errorTitle || "An unexpected error has occurred. Please try again."}
        </p>

        <div className="flex gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 transition px-6 py-2 rounded-xl font-medium"
          >
            <Home size={18} /> Go Home
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 border border-gray-500 px-6 py-2 rounded-xl hover:bg-gray-800 transition"
          >
            <RefreshCcw size={18} /> Reload
          </button>
        </div>

        <p className="mt-10 text-sm text-gray-500 tracking-wide">
          Error Code:{" "}
          <span className="text-red-400 font-semibold">{errorCode}</span>
        </p>
      </motion.div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-4 text-xs text-gray-500"
      >
        © {new Date().getFullYear()} Bookent. All rights reserved.
      </motion.footer>
    </div>
  );
};

export default ErrorPage;
