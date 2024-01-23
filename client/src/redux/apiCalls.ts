import { AxiosError } from "axios";
import { UserData } from "../data/types.ts";
import { publicRequest } from "../middleware/requestMethods";
import { adminAccess, loginFailure, loginStart, loginSuccess } from "./userRedux"
import { Dispatch } from 'redux';

export const login = async (dispatch: Dispatch, user: UserData) => {
  dispatch (loginStart());
  try {
    const response = await publicRequest.post("/auth/login", user)
    dispatch(loginSuccess(response.data))
    if (response.data.isAdmin ){
      dispatch(adminAccess())
      console.log("Admin access")
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    if (error) {
      const status = axiosError.response ? axiosError.response.status : 500; 
    dispatch(loginFailure(status));
    }
  }
}

