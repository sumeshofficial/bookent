import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const createSocket = (token) => {
  return io(SOCKET_URL, {
    auth: { token },
    autoConnect: false,   // Manual connect
  });
};
