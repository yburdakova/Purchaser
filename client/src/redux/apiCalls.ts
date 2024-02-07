import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
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

export const adminRequest = async <T, U = undefined>(
  dispatch: Dispatch, 
  method: Method,
  path: string, 
  token: string, 
  admin: boolean,
  successAction: SuccessAction<T>,
  bodyObj?: U
  ) => {
  dispatch(fetchingStart())
  if (admin && token) {
    try {
      const config: AxiosRequestConfig = {
        method: method,
        url: path,
        data: bodyObj,
      };
      const axiosInstance = userRequest(token);
      const response = await axiosInstance.request<T>(config);
      dispatch(successAction(response.data));
      dispatch(fetchingSuccess());
    } catch (error) {
      const axiosError = error as AxiosError;
      if (error) {
        const status = axiosError.response ? axiosError.response.status : 500; 
        dispatch(fetchingFailure(status));
        }
    }
  }
};

export const getAllUsersData = async <T>(
  path: string, 
  setData?: (value: T | ((prevState: T) => T)) => void
) => {
  try {
    const res = await axios.get<T>(`http://localhost:5000/api/${path}`);
    setData && setData(res.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    if (error) {
      const status = axiosError.response ? axiosError.response.status : 500; 
      console.log(status)
      }
  }
};

export const getAuthUsersData = async <T>(
  path: string, 
  token: string, 
  setData?: (value: T | ((prevState: T) => T)) => void
) => {
  try {
    const res = await userRequest(token).get<T>(path);
    setData && setData(res.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    if (error) {
      const status = axiosError.response ? axiosError.response.status : 500; 
      console.log(status)
      }
  }
};

export const postNotification = async < U>(
  bodyObj: U,
) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/notifications/add_notification`, bodyObj);
    console.log(response.data)
  } catch (error) {
    const axiosError = error as AxiosError;
    if (error) {
      console.log(axiosError.response?.data)
      }
  }
};