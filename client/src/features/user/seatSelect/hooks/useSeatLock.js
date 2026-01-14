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

    const seatUpdateBulkHandler = (lockData) => {
      setSections(lockData);
    };

    const connectHandler = () => {
      socket.emit(SOCKET_EVENTS.JOIN_EVENT, { eventId });
    };

    socket.on(SOCKET_EVENTS.CONNECT, connectHandler);

    if (socket.connected) {
      socket.emit(SOCKET_EVENTS.JOIN_EVENT, { eventId });
    }

    socket.on(SOCKET_EVENTS.SEAT_UPDATE, seatUpdateHandler);
    socket.on(SOCKET_EVENTS.SEAT_UPDATE_BULK, seatUpdateBulkHandler);

    return () => {
      try {
        if (socket && typeof socket.off === "function") {
          socket.off(SOCKET_EVENTS.SEAT_UPDATE, seatUpdateHandler);
          socket.off(SOCKET_EVENTS.SEAT_UPDATE_BULK, seatUpdateBulkHandler);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        // ignore socket.io cleanup errors during reconnect/unmount
      }
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
              closeModal();
              window.location.reload();
            },
          });
          return;
        }
        if (typeof cb === "function") {
          cb(response?.lockId || null);
        }
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
