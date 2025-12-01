import { useContext, useEffect, useState } from "react";
import {
  SOCKET_EVENTS,
  SocketContext,
  useModal,
} from "../../../../utils/constants";

export const useSectionLock = (eventId) => {
  const socket = useContext(SocketContext);
  const [sections, setSections] = useState({});
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    if (!socket) return;

    const seatUpdateHandler = (data) => {
      setSections((prev) => ({
        ...prev,
        [data.sectionId]: {
          status: data.status,
          qty: Number(data.qty),
          lockedBy: data.lockedBy || data.bookedBy,
        },
      }));
    };

    socket.on(SOCKET_EVENTS.CONNECT, () => {
      socket.emit(SOCKET_EVENTS.JOIN_EVENT, { eventId });
    });

    if (socket.connected) {
      socket.emit(SOCKET_EVENTS.JOIN_EVENT, { eventId });
    }

    socket.on(SOCKET_EVENTS.SEAT_UPDATE, seatUpdateHandler);

    return () => {
      socket.off(SOCKET_EVENTS.SEAT_UPDATE, seatUpdateHandler);
      socket.off(SOCKET_EVENTS.CONNECT);
    };
  }, [socket, eventId]);

  // ADD CALLBACK SUPPORT HERE
  const lockSection = (sectionId, qty, cb) => {
    socket.emit(
      SOCKET_EVENTS.LOCK_SECTION,
      { eventId, sectionId, qty },
      (response) => {
        console.log(response);
        if (!response.success) {
          openModal("seat-lock-error", {
            open: true,
            message: response.error,
            onClose: () => {
              closeModal;
              window.location.reload();
            },
          });
        }
        cb(response?.lockId || null);
      }
    );
  };

  const releaseSection = (lockId) => {
    socket.emit(SOCKET_EVENTS.RELEASE_SECTION, { lockId });
  };

  const confirmBooking = (lockIds) => {
    socket.emit(SOCKET_EVENTS.CONFIRM_BOOKING, { lockIds });
  };

  return { sections, lockSection, releaseSection, confirmBooking };
};
