import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { eventById } from "../../../services/user";
import CheckoutNavbar from "../../../sharedComponents/user/navbar/CheckoutNavbar";

import SeatMap from "./components/SeatMap";
import BookingBox from "./components/BookingBox";
import MobileBookingBar from "./components/MobileBookingBar";

const SeatSelectPage = () => {
  const { eventId } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventById(eventId),
    retry: 1,
  });

  const event = data?.event;
  const stadiumShapes = event?.stadium?.shapes || [];

  const [selectedShape, setSelectedShape] = useState(null);

  return (
    <>
      {!isLoading && <CheckoutNavbar title={event?.eventTitle} />}

      <div className="min-h-screen px-4 pt-4 pb-10 w-full bg-gray-100">
        {!isLoading && (
          <div className="flex flex-col lg:flex-row items-start justify-center gap-4 w-full">
            <SeatMap
              shapes={stadiumShapes}
              ticketSetup={event?.ticketSetup || []}
              selectedShape={selectedShape}
              setSelectedShape={setSelectedShape}
            />

            <BookingBox
              selectedShape={selectedShape}
              ticketSetup={event?.ticketSetup || []}
              shapes={stadiumShapes}
              eventId={event._id}
            />

            <MobileBookingBar
              selectedShape={selectedShape}
              ticketSetup={event?.ticketSetup || []}
              shapes={stadiumShapes}
              eventId={event._id}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SeatSelectPage;
