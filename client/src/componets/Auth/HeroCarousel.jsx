import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [0, 1, 2];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
      {/* Stadium Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-pink-600 to-orange-400">
        {/* Stadium pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 80%, rgba(139, 92, 246, 0.4) 0%, transparent 50%)`,
          }}></div>
        </div>
        
        {/* Stadium field effect */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-purple-900/60 to-transparent"></div>
      </div>

      {/* Players */}
      <div className="absolute inset-0 flex items-center justify-between px-8 lg:px-16">
        {/* Left Player - Orange Jersey #34 */}
        <div className="relative w-48 lg:w-72 h-64 lg:h-80">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-blue-500/30 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center border-2 border-white/20">
            <div className="bg-orange-500 text-white px-6 py-3 rounded-lg mb-4">
              <span className="text-5xl lg:text-6xl font-black">34</span>
            </div>
            <div className="text-white text-sm font-semibold">ORANGE FC</div>
          </div>
        </div>

        {/* Center Stadium Info */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/30">
            <div className="text-white text-4xl font-black mb-2">LIVE MATCH</div>
            <div className="text-white/90 text-sm">Dashrath Rangashala Stadium</div>
          </div>
        </div>

        {/* Right Player - Yellow Jersey #7 */}
        <div className="relative w-48 lg:w-72 h-64 lg:h-80">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-purple-500/30 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center border-2 border-white/20">
            <div className="bg-yellow-500 text-white px-6 py-3 rounded-lg mb-4">
              <span className="text-5xl lg:text-6xl font-black">7</span>
            </div>
            <div className="text-white text-sm font-semibold">YELLOW FC</div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              currentSlide === index ? 'bg-white w-8' : 'bg-white/50 w-2'
            }`}
          />
        ))}
      </div>

      {/* Arrow Navigation */}
      <button 
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
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