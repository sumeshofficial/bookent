import Navbar from "../../sharedComponents/Navbar";
import EventDetails from "../../components/user/EventDetails";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { eventById, getEventsForUser } from "../../services/user";
import { useEffect } from "react";

const EventDetailPage = () => {
  const { eventId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventById(eventId),
    retry: 1,
  });

  const { data: eventsData, isLoading: isEventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getEventsForUser,
    onError: () => toast.error("Failed to load events"),
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const recommendedEvents = eventsData?.sections?.recommendedEvents || [];

  const event = data?.event;

  return (
    <div>
      <Navbar />

      {isLoading && (
        <div className="max-w-5xl mx-auto px-4 py-6 animate-pulse space-y-4">
          <div className="w-full h-64 bg-gray-200 rounded-xl"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      )}

      {error && (
        <div className="max-w-3xl mx-auto px-4 py-10 text-center">
          <p className="text-red-600 font-semibold text-lg">
            Failed to load event.
          </p>
          <p className="text-gray-600 mt-2">
            Please check your connection or try again later.
          </p>
        </div>
      )}

      {!isLoading && !event && !error && (
        <div className="max-w-3xl mx-auto px-4 py-10 text-center">
          <p className="text-gray-700 text-xl font-semibold">
            Event not found.
          </p>
          <p className="text-gray-500 mt-2">
            The event you are trying to view may have been removed or deleted.
          </p>
        </div>
      )}

      {!isLoading && event && (
        <EventDetails
          event={event}
          recommendedEvents={recommendedEvents}
          isEventsLoading={isEventsLoading}
        />
      )}

      <footer className="text-center py-6 text-sm text-gray-600 border-t mt-15">
        © {new Date().getFullYear()} Bookent. All rights reserved.
      </footer>
    </div>
  );
};

export default EventDetailPage;
