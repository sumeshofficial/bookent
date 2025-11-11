import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import banner1 from "../assets/FCG_ALN_Article_1180x500-1180x350.png";
import banner2 from "../assets/AFC_article_1180x500-1180x350.png";

const slidesData = [banner1, banner2];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [0, 1];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[180px] sm:h-[350px] rounded-2xl overflow-hidden shadow-2xl">
      {/* Slides */}
      {slidesData.map((slide, index) => (
        <img
          key={index}
          src={slide}
          alt={`Slide ${index}`}
          className={`absolute top-0 left-0 w-full h-full object-cover object-top transition-opacity duration-700 ${
            currentSlide === index ? "opacity-100 z-1" : "opacity-0 z-0"
          }`}
        />
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              currentSlide === index ? "bg-white w-8" : "bg-white/50 w-2"
            }`}
          />
        ))}
      </div>

      {/* Arrow Navigation */}
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors z-10"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors z-10"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default HeroCarousel;
