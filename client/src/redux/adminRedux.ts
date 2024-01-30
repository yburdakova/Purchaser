import { createSlice } from "@reduxjs/toolkit";
import { AdminState } from "../data/types";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    customerRequests: [],
    users: [],
    products: [],
    categories: [],
    notifications: [],
    focusedId: '',
    isFetching: false,
    error: null,
    notifyCounter: 0,
  } as AdminState,
  
  reducers: {
    
    fetchingStart: (state) => {
      state.isFetching = true,
      state.error = null
    },
    setFocusedId: (state, action) => {
      state.focusedId = action.payload
    },
    fetchingSuccess: (state) => {
      state.isFetching = false,
      state.error = null
    },
    addCustomerRequests: (state, action) => {
      state.customerRequests = action.payload
    },
    addUsers: (state, action) => {
      state.users = action.payload
    },
    addProducts: (state, action) => {
      state.products = action.payload
    },
    addCategories: (state, action) => {
      state.categories = action.payload
    },
    getNotifications: (state, action) => {
      state.notifications = action.payload,
      state.notifyCounter = state.notifications.filter(notification => !notification.isRead).length
    },
    postDataSuccess: (state, action)=>{
        console.log(action.payload)
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
  addCustomerRequests,
  addUsers,
  addProducts,
  addCategories,
  fetchingFailure,
  resetError,
  postDataSuccess,
  setFocusedId,
  getNotifications
} = adminSlice.actions;

export default adminSlice.reducer;


