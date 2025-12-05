import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { eventBySlug } from "../../../services/user";

import SeatMap from "./components/SeatMap";
import BookingBox from "./components/BookingBox";
import MobileBookingBar from "./components/MobileBookingBar";
import { useSectionLock } from "./hooks/useSeatLock";
import SeatSelectNavbar from "../../../sharedComponents/user/navbar/SeatSelectNavbar";

const SeatSelectPage = () => {
  const { eventSlug } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["event", eventSlug],
    queryFn: () => eventBySlug(eventSlug),
    retry: 1,
  });

  const event = data?.event;
  const stadiumShapes = event?.stadium?.shapes || [];

  const [selectedShape, setSelectedShape] = useState(null);

  const { lockSection, sections } = useSectionLock(event?._id);

  return (
    <>
      <SeatSelectNavbar title={event?.eventTitle} />

      <div className="min-h-screen px-4 pt-4 pb-10 w-full bg-gray-100">
        {!isLoading && (
          <div className="flex flex-col lg:flex-row items-start justify-center gap-4 w-full">
            <SeatMap
              shapes={stadiumShapes}
              ticketSetup={event?.ticketSetup || []}
              selectedShape={selectedShape}
              setSelectedShape={setSelectedShape}
              lockedSections={sections}
            />

            <BookingBox
              selectedShape={selectedShape}
              ticketSetup={event?.ticketSetup || []}
              shapes={stadiumShapes}
              eventSlug={eventSlug}
              eventId={event._id}
              lockSection={lockSection}
              lockedSections={sections}
            />

            <MobileBookingBar
              selectedShape={selectedShape}
              ticketSetup={event?.ticketSetup || []}
              shapes={stadiumShapes}
              eventSlug={eventSlug}
              eventId={event._id}
              lockSection={lockSection}
              lockedSections={sections}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SeatSelectPage;
