import Navbar from "../../sharedCompents/Navbar";
import HeroCarousel from "../../componets/HeroCarousel";
import RecommendedSection from "../../componets/RecommendedSection";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { updateUserProfile } from "../../Redux/userSlice";
import useGeoLocation from "../../hooks/useGeoLocation";

const HomePage = () => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const { locationInfo, locationError } = useGeoLocation();

  useEffect(() => {
    if (user && !user.location && locationInfo) {
      const { latitude, longitude } = locationInfo;

      const data = {
        location: {
          latitude, 
          longitude,
        },
      };

      dispatch(updateUserProfile({ id: user._id, data }));
    }
  }, [user, locationInfo, dispatch]);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-100 to-gray-200 text-gray-900">
      <Navbar />

      <main className="px-4 sm:px-8 lg:px-16 xl:px-14 py-8 space-y-5 mx-auto">
        <section>
          <HeroCarousel />
        </section>

        <section>
          <RecommendedSection />
        </section>
      </main>

      <footer className="text-center py-6 border-t border-gray-300 text-sm text-gray-600">
        © {new Date().getFullYear()} Bookent. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
