import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const HeroCarousel = ({ banners = [], loading = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    if (!banners.length) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  if (loading) {
    return (
      <div className="w-full h-[180px] sm:h-[350px] rounded-2xl bg-gray-200 animate-pulse" />
    );
  }

  if (!banners.length) return null;

  return (
    <div className="relative w-full h-[180px] sm:h-[350px] rounded-2xl overflow-hidden shadow-2xl">
      {banners.map((banner, index) => {
        const imageSrc =
          isMobile && banner.mobileImage ? banner.mobileImage : banner.image;

        return (
          <img
            key={banner._id}
            src={imageSrc}
            alt={banner.title || `Banner ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        );
      })}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              currentSlide === index ? "bg-white w-8" : "bg-white/50 w-2"
            }`}
          />
        ))}
      </div>

      <button
        onClick={() =>
          setCurrentSlide(
            (prev) => (prev - 1 + banners.length) % banners.length
          )
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 z-20"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>

      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 z-20"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>
    </div>
  );
};

export default HeroCarousel;
