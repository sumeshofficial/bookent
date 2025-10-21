import EventCard from "./EventCards";

const RecommendedSection = () => {
  return (
    <div className="mt-12">
      <h2 className="text-3xl font-black text-gray-900 mb-6">Recommended</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
      </div>
    </div>
  );
};

export default RecommendedSection;