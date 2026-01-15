import { useContext, useEffect, useState, useCallback, useRef } from "react";
import {
  SOCKET_EVENTS,
  SocketContext,
  useModal,
} from "../../../../utils/constants";

export const useSectionLock = (eventId) => {
  const socket = useContext(SocketContext);
  const [sections, setSections] = useState({});
  const [isRoomReady, setIsRoomReady] = useState(false);
  const { openModal, closeModal } = useModal();
  const joinedRef = useRef(false);

  const connectHandler = useCallback(() => {
    if (!socket || !eventId) return;
    if (joinedRef.current) return;
    joinedRef.current = true;

    socket.emit(SOCKET_EVENTS.JOIN_EVENT, { eventId }, () => {
      setIsRoomReady(true);
    });
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
    if (!socket || !eventId) return;

    socket.on(SOCKET_EVENTS.SEAT_UPDATE, seatUpdateHandler);
    socket.on(SOCKET_EVENTS.SEAT_UPDATE_BULK, seatUpdateBulkHandler);

    const currentConnectHandler = connectHandler;
    if (socket.connected) {
      currentConnectHandler();
    } else {
      socket.once(SOCKET_EVENTS.CONNECT, currentConnectHandler);
    }

    return () => {
      socket.off(SOCKET_EVENTS.SEAT_UPDATE);
      socket.off(SOCKET_EVENTS.SEAT_UPDATE_BULK);
      socket.off(SOCKET_EVENTS.CONNECT);
    };
  }, [
    socket,
    eventId,
    connectHandler,
    seatUpdateHandler,
    seatUpdateBulkHandler,
  ]);

  useEffect(() => {
    if (!socket) return;

    const handleDisconnect = () => {
      setIsRoomReady(false);
      joinedRef.current = false;
    };

    socket.on("disconnect", handleDisconnect);
    return () => socket.off("disconnect", handleDisconnect);
  }, [socket]);

  const lockSection = (sectionId, qty, cb) => {
    if (!eventId || !socket || !isRoomReady) {
      openModal("seat-lock-error", {
        open: true,
        message: "Connection not ready. Please try again.",
        onClose: () => {
          closeModal();
          window.location.reload();
        },
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
    if (socket?.connected) {
      socket.emit(SOCKET_EVENTS.RELEASE_SECTION, { lockId });
    }
  };

  const confirmBooking = (lockIds) => {
    socket.emit(SOCKET_EVENTS.CONFIRM_BOOKING, { lockIds });
  };

  return { sections, lockSection, releaseSection, confirmBooking };
};
