import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../../../utils/constants";

export const useSectionLock = (eventId) => {
  const socket = useContext(SocketContext);
  const [sections, setSections] = useState({});

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-event", { eventId });

    socket.on("seat-update", (data) => {
      console.log("WS RECEIVED →", JSON.stringify(data, null, 2));
      setSections((prev) => ({
        ...prev,
        [data.sectionId]: {
          status: data.status,
          qty: Number(data.qty),
          lockedBy: data.lockedBy ?? null,
        },
      }));
    });

    return () => socket.off("seat-update");
  }, [socket, eventId]);

  // ADD CALLBACK SUPPORT HERE
  const lockSection = (sectionId, qty, cb) => {
    socket.emit("lock-section", { eventId, sectionId, qty }, (response) => {
      cb(response?.lockId || null);
    });
  };

  const releaseSection = (lockId) => {
    socket.emit("release-section", { lockId });
  };

  const confirmBooking = (lockIds) => {
    socket.emit("confirm-booking", { lockIds });
  };

  return { sections, lockSection, releaseSection, confirmBooking };
};
