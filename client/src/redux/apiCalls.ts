import axios, { AxiosError } from "axios";
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

export const postAdminData = async <T, U>(
  dispatch: Dispatch, 
  path: string,
  bodyObj: U,
  token: string, 
  admin: boolean,
  successAction: SuccessAction<T>
  ) => {
  dispatch(fetchingStart())
  if (admin && token) {
    try {
      const response = await userRequest(token).post(path, bodyObj);
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

export const deleteAdminData = async <T>(
  dispatch: Dispatch, 
  path: string,
  id: string,
  token: string, 
  admin: boolean,
  successAction: SuccessAction<T>
  ) => {
  dispatch(fetchingStart())
  if (admin && token) {
    try {
      const response = await userRequest(token).delete(`${path}/${id}`);
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

export const getAllUsersData = async <T>(
  path: string, 
  setData: (value: T | ((prevState: T) => T)) => void
) => {
  try {
    const res = await axios.get<T>(`http://localhost:5000/api/${path}`);
    setData(res.data);
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
  setData: (value: T | ((prevState: T) => T)) => void
) => {
  try {
    const res = await userRequest(token).get<T>(path);
    setData(res.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    if (error) {
      const status = axiosError.response ? axiosError.response.status : 500; 
      console.log(status)
      }
  }
};

export const postNotificaton = async < U>(
  bodyObj: U,
) => {
  console.log(bodyObj)
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