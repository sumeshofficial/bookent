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
    if (!socket || !eventId) return;

    const seatUpdateHandler = (data) => {
      setSections((prev) => ({
        ...prev,
        [data.sectionId]: {
          status: data.status,
          qty: Number(data.qty),
          lockedBy: data.lockedBy || data.bookedBy || data.userId,
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

    socket.on(SOCKET_EVENTS.SEAT_UPDATE_BULK, (lockData) => {
      setSections(lockData);
    });

    return () => {
      socket.off(SOCKET_EVENTS.SEAT_UPDATE, seatUpdateHandler);
      socket.off(SOCKET_EVENTS.CONNECT);
    };
  }, [socket, eventId]);

  const lockSection = (sectionId, qty, cb) => {
    if (!eventId) return;
    socket.emit(
      SOCKET_EVENTS.LOCK_SECTION,
      { eventId, sectionId, qty },
      (response) => {
        if (!response.success) {
          openModal("seat-lock-error", {
            open: true,
            message: response.error,
            onClose: () => {
              closeModal;
              window.location.reload();
            },
          });
          return;
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
