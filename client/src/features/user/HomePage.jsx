import Navbar from "../../sharedComponents/user/navbar/Navbar";
import HeroCarousel from "../../components/home/HeroCarousel";
import EventRow from "../../components/home/EventRow";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { updateUserProfile } from "../../app/userSlice";
import useGeoLocation from "../../hooks/useGeoLocation";
import { getEventsForUser } from "../../services/user";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const HomePage = () => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const { locationInfo } = useGeoLocation();

  const { data, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getEventsForUser,
    onError: () => toast.error("Failed to load events"),
  });

  const recommendedEvents = data?.recommendedEvents || [];
  const trendingEvents = data?.trendingEvents || [];
  const liveEvents = data?.liveEvents || [];
  const popularInYourCity = data?.popularInYourCity || [];

  useEffect(() => {
    if (user && !user.location && locationInfo) {
      const { latitude, longitude } = locationInfo;
      dispatch(
        updateUserProfile({
          id: user._id,
          data: { location: { latitude, longitude } },
        })
      );
    }
  }, [user, locationInfo, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="px-4 sm:px-8 lg:px-12 py-6 space-y-10">
        <HeroCarousel />

        {recommendedEvents.length > 0 && (
          <EventRow
            title="Recommended For You"
            events={recommendedEvents}
            seeAllLink="/events/recommended"
            loading={isLoading}
          />
        )}

        {trendingEvents.length > 0 && (
          <EventRow
            title="Trending Now"
            events={trendingEvents}
            seeAllLink="/events/trending"
            loading={isLoading}
          />
        )}

        {liveEvents.length > 0 && (
          <EventRow
            title="Live Now"
            events={liveEvents}
            seeAllLink="/events/live"
            loading={isLoading}
          />
        )}

        {popularInYourCity.length > 0 && (
          <EventRow
            title="Popular in Your City"
            events={popularInYourCity}
            seeAllLink="/events/popular"
            loading={isLoading}
          />
        )}
      </main>

      <footer className="text-center py-6 text-sm text-gray-600 border-t mt-15">
        © {new Date().getFullYear()} Bookent. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
