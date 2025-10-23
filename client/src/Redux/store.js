import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./userSlice";
import organizerReducer from "./organizerSlice";

const persistConfig = {
  key: "root",
  storage,
};

const organizerPersistConfig = {
  key: "organizer",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedOrganizerReducer = persistReducer(organizerPersistConfig, organizerReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    organizer: persistedOrganizerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
        ],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
