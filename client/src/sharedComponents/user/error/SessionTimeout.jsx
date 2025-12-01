import { AlarmClock, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/bookent-logo-black.png";

const SessionTimeout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("sessionExpired", "1");

    window.history.pushState(null, null, window.location.href);

    const onPop = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", onPop);

    return () => {
      window.removeEventListener("popstate", onPop);
      localStorage.removeItem("sessionExpired");
    };
  }, [navigate]);

  const goBack = () => {
    localStorage.removeItem("sessionExpired");
    navigate("/", { replace: true });
  };

  return (
    <div className="w-full h-screen bg-linear-to-br from-red-50 to-orange-100 flex flex-col items-center justify-center px-4">
      <img className="w-40 lg:w-50 mb-6 opacity-90" src={logo} alt="Bookent" />
      <div className="p-4 bg-white/70 rounded-full shadow-md mb-4">
        <AlarmClock className="w-14 h-14 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Session Expired
      </h1>
      <p className="text-gray-600 text-center text-sm max-w-sm mb-6">
        Your booking session timed out. Please start again to continue.
      </p>
      <button
        onClick={goBack}
        className="
          flex items-center gap-2 
          bg-red-500 hover:bg-red-600 
          text-white px-5 py-2.5 
          rounded-lg text-sm font-medium 
          shadow-md hover:shadow-lg 
          transition-all active:scale-95
        "
      >
        <ArrowLeft size={16} />
        Book Again
      </button>
    </div>
  );
};

export default SessionTimeout;
