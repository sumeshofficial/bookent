import Pagination from "../../../sharedComponents/Pagination";
import Navbar from "../../../sharedComponents/user/navbar/Navbar";
import TicketCard from "./components/TicketCard";
import TicketFilters from "./components/TicketFilter";
import TicketSkeleton from "./components/TicketSkeleton";
import { useMyTickets } from "./hooks/useMyTickets";

const MyTickets = () => {
  const { data, isLoading, isError } = useMyTickets();

  const meta = data?.meta;
  const tickets = data?.updatedOrders;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-200 py-6 sm:py-10 px-3 space-y-5">
        <TicketFilters />
        {isLoading && (
          <>
            <TicketSkeleton />
            <TicketSkeleton />
          </>
        )}

        {isError && (
          <p className="text-center text-red-600">Failed to load tickets</p>
        )}

        {!isLoading && tickets?.length === 0 && (
          <p className="text-center text-gray-600">No tickets found</p>
        )}

        <div className="space-y-6">
          {tickets?.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}

          {meta && meta.totalPages > 1 && <Pagination meta={meta} />}
        </div>
      </div>
    </>
  );
};

export default MyTickets;
