import { useCallback, useEffect, useMemo } from "react";
import { createSocket } from "../lib/socket";
import { useDispatch } from "react-redux";
import { logoutUser } from "../app/userSlice";
import { logoutOrganizer } from "../app/organizerSlice";
import { logout } from "../services/auth";
import toast from "react-hot-toast";
import { SOCKET_EVENTS, SocketContext } from "../utils/constants";
import PropTypes from "prop-types";

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("adminAccessToken");

  const socket = useMemo(() => {
    if (!token) return null;
    return createSocket(token);
  }, [token]);

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
    if (!socket) return;

    socket.connect();

    const userBlockedHandler = (data) => {
      toast.error(data.message || "You have been blocked.");
      handleLogout();
    };

    socket.on(SOCKET_EVENTS.USER_BLOCKED, userBlockedHandler);

    return () => {
      socket.off(SOCKET_EVENTS.USER_BLOCKED, userBlockedHandler);
      socket.disconnect();
    };
  }, [socket, handleLogout]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
