import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "../data/types";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isFetching: false,
    isAdmin: false,
    isActive: true,
    error: null
  } as UserState,
  
  reducers: {
    
    loginStart: (state) => {
      state.isFetching = true,
      state.error = null
    },
    loginFinish: (state) => {
      state.currentUser = null,
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.isFetching = false,
      state.currentUser = action.payload,
      state.error = null
    },
    adminAccess: (state) => {
      state.isAdmin = true
    },
    loginFailure: (state, action) => {
      state.isFetching = false;
      if (action.payload === 401) {
        state.error = "Неверный email или пароль";
      } else {
        state.error = "Что-то пошло не так...";
      }
    },
    resetError: (state) => {
      state.error = null;
    },
  }
});

export const { 
  loginStart, 
  loginFinish,
  loginSuccess,
  loginFailure,
  resetError,
  adminAccess

} = userSlice.actions;

export default userSlice.reducer;


