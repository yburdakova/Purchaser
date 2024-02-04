import { createSlice } from "@reduxjs/toolkit";
import { NotificationsState } from "../data/types";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    notifyCounter: 0,
    notifications: [],
    focusedId: '',
    actualNotificationId: '',
    isFetching: false,
    error: null,
  } as NotificationsState,
  
  reducers: {
    
    fetchingStart: (state) => {
      state.isFetching = true,
      state.error = null
    },
    setFocusedId: (state, action) => {
      state.focusedId = action.payload
    },
    setActualNotificationId: (state, action) => {
      state.focusedId = action.payload
    },
    fetchingSuccess: (state) => {
      state.isFetching = false,
      state.error = null
    },
    getNotifications: (state, action) => {
      state.notifications = action.payload,
      state.notifyCounter = state.notifications.filter(notification => !notification.isRead).length
    },
    fetchingFailure: (state, action) => {
      state.isFetching = false;
      state.error= action.payload
    },
    resetError: (state) => {
      state.error = null;
    },
  }
});

export const { 
  fetchingStart, 
  fetchingSuccess,
  fetchingFailure,
  resetError,
  setFocusedId,
  setActualNotificationId,
  getNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;


