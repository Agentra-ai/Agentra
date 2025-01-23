import axios from "axios"

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost") {
      return "http://localhost:3000"
    } else if (window.location.hostname === "demo-ai-eight.vercel.app") {
      return "https://demo-ai-eight.vercel.app"
    } else if (
      window.location.hostname ===
      "demo-ai-git-dev-divyeshradadiyas-projects.vercel.app"
    ) {
      return "https://demo-ai-git-dev-divyeshradadiyas-projects.vercel.app"
    } else {
      return "http://localhost:3000"
    }
  } else {
    return "http://localhost:3000"
  }
}

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
})

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data)

export default fetcher

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
