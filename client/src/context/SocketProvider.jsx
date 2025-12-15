import { useCallback, useEffect, useState } from "react";
import { createSocket } from "../lib/socket";
import { useDispatch } from "react-redux";
import { logoutUser } from "../app/userSlice";
import { logoutOrganizer } from "../app/organizerSlice";
import { logout } from "../services/auth";
import toast from "react-hot-toast";
import { SOCKET_EVENTS, SocketContext } from "../utils/constants";

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);

  const token = localStorage.getItem("accessToken") || localStorage.getItem("adminAccessToken");

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      dispatch(logoutUser());
      dispatch(logoutOrganizer());
    } catch (error) {
      toast.error(error.message);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!token) return;

    const socket = createSocket(token);
    socket.connect();

    // Listen for block event
    socket.on(SOCKET_EVENTS.USER_BLOCKED, (data) => {
      toast.error(data.message || "You have been blocked.");
      handleLogout();
    });

    socket.on("connect_error", (err) => {
      console.log(err.message);
      console.log(err.data);
    });

    setSocket(socket);

    return () => socket.disconnect();
  }, [token, handleLogout]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
