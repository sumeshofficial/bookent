import { useCallback, useEffect, useState } from "react";
import { createSocket } from "../lib/socket";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/userSlice";
import { logoutOrganizer } from "../redux/organizerSlice";
import { logout } from "../services/auth";
import toast from "react-hot-toast";
import { SOCKET_EVENTS, SocketContext } from "../utils/constants";

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);

  const token = localStorage.getItem("accessToken");

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

    const s = createSocket(token);
    s.connect();

    // Listen for block event
    s.on(SOCKET_EVENTS.USER_BLOCKED, (data) => {
      toast.error(data.message || "You have been blocked.");
      handleLogout();
    });

    setSocket(s);

    return () => s.disconnect();
  }, [token, handleLogout]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
