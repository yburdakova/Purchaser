import { createSlice } from "@reduxjs/toolkit";
import { AdminState } from "../data/types";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    customerRequests: [],
    users: [],
    orders: [],
    products: [],
    categories: [],
    isFetching: false,
    error: null,
    response: null
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
      state.customerRequests = [...action.payload].reverse();
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
    addOrders: (state, action) => {
      state.orders = [...action.payload].reverse();
    },
    postDataSuccess: (state, action)=>{
      state.response = action.payload;
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
  addOrders,
  addCategories,
  fetchingFailure,
  resetError,
  postDataSuccess,
} = adminSlice.actions;

export default adminSlice.reducer;


