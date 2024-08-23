import axios from "axios"

export const SERVER_URL = "https://server.burdakova.com/api"

export const BASE_URL = SERVER_URL

export const publicRequest = axios.create({
  baseURL: BASE_URL
})

export const userRequest = (token: string | undefined) => axios.create({
  baseURL: SERVER_URL,
  headers: {
    token: `Bearer ${token}`
  }
})