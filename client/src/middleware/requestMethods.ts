import axios from "axios"

export const LOCAL_URL = "http://localhost:5000/api"
export const SERVER_URL = "https://server.burdakova.com/api"

export const BASE_URL = LOCAL_URL

export const publicRequest = axios.create({
  baseURL: BASE_URL
})

export const userRequest = (token: string | undefined) => axios.create({
  baseURL: BASE_URL,
  headers: {
    token: `Bearer ${token}`
  }
})