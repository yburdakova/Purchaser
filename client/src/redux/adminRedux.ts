import { createSlice } from "@reduxjs/toolkit";
import { AdminState } from "../data/types";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    customerRequests: [],
    users: [],
    products: [],
    categories: [],
    isFetching: false,
    error: null,
    notifyCounter: 0,
  } as AdminState,
  
  reducers: {
    
    fetchingStart: (state) => {
      state.isFetching = true,
      state.error = null
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
    postDataSuccess: (state, action)=>{
        console.log(action.payload)
    },
    updateNotify: (state, action) => {
      state.notifyCounter = action.payload
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
  updateNotify,
  fetchingFailure,
  resetError,
  postDataSuccess
} = adminSlice.actions;

export default adminSlice.reducer;


