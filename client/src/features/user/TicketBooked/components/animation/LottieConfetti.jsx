import Lottie from "lottie-react";
import confettiJson from "../../../../../assets/Confetti.json";

const LottieConfetti = () => (
  <div className="absolute inset-0 z-50 pointer-events-none">
    <Lottie animationData={confettiJson} loop={false} />
  </div>
);

export default LottieConfetti;
