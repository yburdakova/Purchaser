import axios from "axios"

export const BASE_URL = "https://18.224.139.223/api"
export const LOCKAL_URL = "http://localhost:5000/api"

export const publicRequest = axios.create({
  baseURL: BASE_URL
})

export const userRequest = (token: string | undefined) => axios.create({
  baseURL: BASE_URL,
  headers: {
    token: `Bearer ${token}`
  }
})