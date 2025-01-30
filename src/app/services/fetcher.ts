// import auth from "@/main-auth";
import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
})

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data)

export default fetcher

