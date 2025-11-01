import bgImage from "../../assets/welcomePage-bg.png";
import bookentLogo from "../../assets/bookent-logo-white.png";
import { useModal } from "../../utils/constants";

const WelcomePage = () => {
  const { openModal } = useModal();
  return (
    <div
      className="w-full h-screen bg-cover bg-center text-white flex flex-col"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Header */}
      <div className="w-full flex justify-between items-center px-4 py-5 sm:px-10 sm:py-5">
        <img
          src={bookentLogo}
          alt="Bookent Logo"
          className="w-24 sm:w-32 md:w-36 h-auto"
        />
        <button
          onClick={() => openModal("auth")}
          className="bg-black bg-opacity-60 py-1 px-4 sm:py-2 sm:px-6 rounded-full border border-white "
        >
          <span className="text-sm sm:text-base font-medium">Get Started</span>
        </button>
      </div>

      {/* Divider line */}
      <div className="border-t"></div>

      {/* Main content centered */}
      <div className="flex flex-1 items-center px-4 sm:px-10">
        <div>
          <p className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight max-w-3xl">
            Sport, Passion & Moments
          </p>
          <p className="mt-5 text-lg sm:text-2xl text-gray-200 max-w-2xl">
            Welcome to Bookent — your ticket to the best sports experiences.
          </p>
          <button
            onClick={() => openModal("auth")}
            className="bg-black mt-8 bg-opacity-60 py-2 px-6 sm:py-3 sm:px-8 rounded-full border border-white hover:bg-opacity-80 transition"
          >
            <span className="text-sm sm:text-lg font-medium">Book Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
