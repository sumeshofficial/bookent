import { io } from "socket.io-client";
import { ENV } from "../config/env";

const SOCKET_URL = ENV.VITE_SOCKET_URL;

export const createSocket = (token) => {
  return io(SOCKET_URL, {
    auth: { token },
    autoConnect: false, 
  });
};
