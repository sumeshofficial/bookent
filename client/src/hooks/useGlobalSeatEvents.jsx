import { useContext, useEffect, useCallback } from "react";
import { SOCKET_EVENTS, SocketContext } from "../utils/constants";

const useGlobalSeatEvents = () => {
  const socket = useContext(SocketContext);

  const handleSeatUpdate = useCallback(
    (data) => {
      console.log("GLOBAL seat-update:", data);
    },
    []
  );

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_EVENTS.SEAT_UPDATE, handleSeatUpdate);

    return () => socket.off(SOCKET_EVENTS.SEAT_UPDATE, handleSeatUpdate);
  }, [socket, handleSeatUpdate]);
};

export default useGlobalSeatEvents;
