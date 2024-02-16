import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userRedux";
import adminReducer from "./adminRedux";
import orderReducer from "./orderRedux"
import notificationReducer from "./notificationRedux"
import custdashboardReducer from "./custDashboardRedux"
import admDashboardRedux from "./admDashboardRedux";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}
const rootReducer = combineReducers({ 
  user: userReducer,
  admin: adminReducer,
  order: orderReducer,
  notifications: notificationReducer,
  custdashboard: custdashboardReducer,
  admdashboard: admDashboardRedux
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
