import { createContext, useContext } from "react";

// Modal
export const ModalContext = createContext();
export const useModal = () => useContext(ModalContext);

// Form
export const FromContext = createContext();
export const useContextForm = () => useContext(FromContext);

// Socket
export const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const ACTIONS = {
  SELECT: "SELECT",
  RECTANGLE: "RECTANGLE",
  CIRCLE: "CIRCLE",
  ARC: "ARC",
};

export const PREFERENCE_OPTIONS = {
  sport: {
    label: "Your favorite Sport",
    values: [
      "Football",
      "Cricket",
      "Basketball",
      "Tennis",
      "Badminton",
      "Volleyball",
    ],
  },
  venue: {
    label: "Preferred Locations / Venues",
    values: ["Kochi", "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"],
  },
  matchTime: {
    label: "Preferred Match Time",
    values: ["Morning", "Afternoon", "Evening", "Night"],
  },
  priceRange: {
    label: "Price Range",
    values: ["0 - 500", "500 - 2000", "2000 - 5000", "5000+"],
  },
};

// Socket events
export const SOCKET_EVENTS = {
  USER_BLOCKED: "user-blocked",
  CONNECT: "connect",
  JOIN_EVENT: "join-event",
  SEAT_UPDATE: "seat-update",
  SEAT_UPDATE_BULK: "seat-update-bulk",
  LOCK_SECTION: "lock-section",
  RELEASE_SECTION: "release-section",
  CONFIRM_BOOKING: "confirm-booking",
  PAYMENT_STATUS: "payment-status",
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
