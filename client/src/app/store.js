import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import userReducer from "./userSlice";
import adminReducer from "./adminSlice";
import organizerReducer from "./organizerSlice";

const UserPersistConfig = {
  key: "user",
  storage,
};

const adminPersistConfig = {
  key: "admin",
  storage,
};

const organizerPersistConfig = {
  key: "organizer",
  storage,
};

const persistedUserReducer = persistReducer(UserPersistConfig, userReducer);
const persistedAdminReducer = persistReducer(adminPersistConfig, adminReducer);
const persistedOrganizerReducer = persistReducer(
  organizerPersistConfig,
  organizerReducer
);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    admin: persistedAdminReducer,
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
