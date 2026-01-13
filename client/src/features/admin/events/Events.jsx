import Pagination from "../../../sharedComponents/Pagination";
import EventsFilters from "./components/EventsFilters";
import EventsSkeleton from "./components/EventsSkeleton";
import EventsTable from "./components/EventsTable";
import { useEvents } from "./hooks/useEvents";

const Events = () => {
  const { data, isLoading } = useEvents();

  return (
    <div className="space-y-4">
      <EventsFilters />

      {isLoading ? (
        <EventsSkeleton />
      ) : (
        <>
          <EventsTable events={data?.events || []} />

          <Pagination meta={data?.meta} />
        </>
      )}
    </div>
  );
};

export default Events;
