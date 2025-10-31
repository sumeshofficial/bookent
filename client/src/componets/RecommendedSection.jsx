import EventCard from "./EventCards";

const RecommendedSection = () => {
  return (
    <section className="px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Recommended Events
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
      </div>
    </section>
  );
};

export default RecommendedSection;
