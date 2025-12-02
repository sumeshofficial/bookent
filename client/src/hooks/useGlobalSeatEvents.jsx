import { useContext, useEffect, useCallback } from "react";
import { SOCKET_EVENTS, SocketContext } from "../utils/constants";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useGlobalSeatEvents = () => {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);

  const handleSeatUpdate = useCallback(
    (data) => {
      console.log("GLOBAL seat-update:", data);

      if (data?.isExpired && data?.userId === user?._id) {
        sessionStorage.removeItem("lockId");
        navigate("/session-expired", { replace: true });
      }
    },
    [navigate, user?._id]
  );

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_EVENTS.SEAT_UPDATE, handleSeatUpdate);

    return () => socket.off(SOCKET_EVENTS.SEAT_UPDATE, handleSeatUpdate);
  }, [socket, handleSeatUpdate]);
};

export default useGlobalSeatEvents;
