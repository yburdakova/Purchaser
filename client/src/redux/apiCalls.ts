import { AxiosError } from "axios";
import { SuccessAction, UserData } from "../data/types.ts";
import { publicRequest, userRequest } from "../middleware/requestMethods";
import { adminAccess, loginFailure, loginStart, loginSuccess } from "./userRedux"
import { Dispatch } from 'redux';
import { fetchingFailure, fetchingStart, fetchingSuccess } from "./adminRedux.ts";

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

export const getAdminData = async <T>(
  dispatch: Dispatch, 
  path: string, 
  token: string, 
  admin: boolean,
  successAction: SuccessAction<T>
  ) => {
  dispatch(fetchingStart())
  if (admin && token) {
    try {
      const response = await userRequest(token).get(path);
      dispatch(successAction(response.data));
      dispatch(fetchingSuccess())
    } catch (error) {
      const axiosError = error as AxiosError;
      if (error) {
        const status = axiosError.response ? axiosError.response.status : 500; 
        dispatch(fetchingFailure(status));
        }
    }
  }
};