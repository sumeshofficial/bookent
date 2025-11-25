import { createContext, useContext } from "react";

// Modal
export const ModalContext = createContext();
export const useModal = () => useContext(ModalContext);

// Form
export const FromContext = createContext();
export const useContextForm = () => useContext(FromContext);

// Socket
export const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const ACTIONS = {
  SELECT: "SELECT",
  RECTANGLE: "RECTANGLE",
  CIRCLE: "CIRCLE",
  ARC: "ARC"
};
