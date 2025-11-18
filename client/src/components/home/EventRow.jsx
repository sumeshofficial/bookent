import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "./EventCard";
import { useEffect, useRef, useState } from "react";

const SkeletonCard = () => (
  <div className="min-w-32 sm:min-w-55 md:min-w-60">
    <div className="w-full aspect-9/16 bg-gray-200 rounded-lg animate-pulse" />
    <div className="h-3 bg-gray-200 rounded mt-2 w-3/4 animate-pulse" />
    <div className="h-3 bg-gray-200 rounded mt-1 w-1/2 animate-pulse" />
  </div>
);

const EventRow = ({ title, events, seeAllLink, loading = false }) => {
  const scrollRef = useRef(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const atStart = el.scrollLeft <= 5;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

    setShowLeft(!atStart);
    setShowRight(!atEnd);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener("scroll", checkScroll);

    return () => el.removeEventListener("scroll", checkScroll);
  }, [events, loading]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="space-y-4 mt-8 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-base sm:text-xl font-semibold text-gray-800">{title}</h2>

        {!loading && events?.length > 0 && (
          <Link
            to={seeAllLink}
            className="text-sm text-purple-600 hover:underline font-medium"
          >
            See All →
          </Link>
        )}
      </div>

      {showLeft && (
        <button
          onClick={scrollLeft}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 
          w-10 h-10 rounded-full bg-black/40 shadow-md z-20 items-center justify-center
          hover:bg-black/60 transition"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {showRight && (
        <button
          onClick={scrollRight}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 
          w-10 h-10 rounded-full bg-black/40 shadow-md z-20 items-center justify-center
          hover:bg-black/60 transition"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      <div
        ref={scrollRef}
        id={title}
        className="overflow-x-auto scrollbar-hide scroll-smooth"
      >
        <div className="flex gap-3 sm:gap-4 pr-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : events?.map((event) => (
                <EventCard key={event?._id} event={event} />
              ))}
        </div>
      </div>
    </section>
  );
};

export default EventRow;
