import EventHeader from "./components/EventHeader";
import EventMeta from "./components/EventMeta";
import EventPricing from "./components/EventPricing";
import EventStatus from "./components/EventStatus";
import EventSkeleton from "./components/EventSkeleton";
import EventError from "./components/EventError";
import { useEventDetails } from "./hooks/useEventDetails";
import EventImages from "./components/EventImages";
import EventDescription from "./components/EventDescription";
import EventTags from "./components/EventTags";
import BackButton from "./components/BackButton";

const Event = () => {
  const { data, isLoading, isError } = useEventDetails();

  if (isLoading) return <EventSkeleton />;
  if (isError) return <EventError />;

  const event = data;

  return (
    <div className="space-y-4 sm:px-6 sm:py-4 p-3 bg-white rounded-2xl">
      <BackButton label="Back to Events" />

      <EventHeader
        title={event.eventTitle}
        status={event.eventStatus}
      />

      <EventImages
        bannerImage={event.bannerImage}
        thumbnailImage={event.thumbnailImage}
      />

      <EventTags tags={event.tags} />

      <EventMeta event={event} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EventPricing
          minPrice={event.minPrice}
          maxPrice={event.maxPrice}
          ticketSetup={event.ticketSetup}
          shapes={event.stadium.shapes}
        />

        <EventStatus event={event} />
      </div>

      <EventDescription
        description={event.eventDescription}
        ageRestriction={event.ageRestriction}
        terms={event.termsAndConditions}
      />
    </div>
  );
};

export default Event;