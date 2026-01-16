import { useContext, useEffect } from "react";
import { SOCKET_EVENTS, SocketContext } from "../utils/constants";

const useGlobalSeatEvents = () => {
  const socket = useContext(SocketContext);

  const seatUpdateHandler = async () => {
  }

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_EVENTS.SEAT_UPDATE, seatUpdateHandler);

    return () => socket.off(SOCKET_EVENTS.SEAT_UPDATE, seatUpdateHandler);
  }, [socket]);
};

export default useGlobalSeatEvents;
