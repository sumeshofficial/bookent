import Navbar from "../sharedCompents/Navbar";
import HeroCarousel from "../componets/HeroCarousel";
import RecommendedSection from "../componets/RecommendedSection";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="px-3 lg:px-15 py-6">
        <HeroCarousel />
        <RecommendedSection />
      </main>
    </div>
  );
};

export default HomePage;
