import { useContext, useEffect, useState, useCallback } from "react";
import {
  SOCKET_EVENTS,
  SocketContext,
  useModal,
} from "../../../../utils/constants";

export const useSectionLock = (eventId) => {
  const socket = useContext(SocketContext);
  const [sections, setSections] = useState({});
  const { openModal, closeModal } = useModal();

  const connectHandler = useCallback(() => {
    socket.emit(SOCKET_EVENTS.JOIN_EVENT, { eventId });
  }, [socket, eventId]);

  const seatUpdateHandler = useCallback((data) => {
    setSections((prev) => ({
      ...prev,
      [data.sectionId]: {
        status: data.status,
        qty: Number(data.qty),
        lockedBy: data.lockedBy || data.bookedBy || data.userId,
      },
    }));
  }, []);

  const seatUpdateBulkHandler = useCallback((lockData) => {
    setSections(lockData);
  }, []);

  useEffect(() => {
    if (!socket?.on || !eventId) return;

    socket.on(SOCKET_EVENTS.CONNECT, connectHandler);
    socket.on(SOCKET_EVENTS.SEAT_UPDATE, seatUpdateHandler);
    socket.on(SOCKET_EVENTS.SEAT_UPDATE_BULK, seatUpdateBulkHandler);

    if (socket.connected) {
      connectHandler();
    }
    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, connectHandler);
      socket.off(SOCKET_EVENTS.SEAT_UPDATE);
      socket.off(SOCKET_EVENTS.SEAT_UPDATE_BULK, seatUpdateBulkHandler);
    };
  }, [
    socket,
    eventId,
    connectHandler,
    seatUpdateHandler,
    seatUpdateBulkHandler,
  ]);

  const lockSection = (sectionId, qty, cb) => {
    if (!eventId || !socket || !socket.connected) {
      openModal("seat-lock-error", {
        open: true,
        message: "Connection not ready. Please try again.",
        onClose: () => closeModal(),
      });
      return;
    }
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
