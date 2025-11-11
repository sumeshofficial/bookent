import { createContext, useContext } from "react";

export const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const FromContext = createContext();

export const useContextForm = () => useContext(FromContext);

export const ACTIONS = {
  SELECT: "SELECT",
  RECTANGLE: "RECTANGLE",
  CIRCLE: "CIRCLE",
};
