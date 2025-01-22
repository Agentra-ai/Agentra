import axios from 'axios';

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const { baseURL, logRequests } = require(`@/config/${env}`).config;

export const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (logRequests) {
      console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`);
      console.log('Request Config:', config);
    }
    return config;
  },
  (error) => {
    if (logRequests) {
      console.error('[Request Error]', error);
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (logRequests) {
      console.log(`[Response] ${response.status} ${response.config.url}`);
      console.log('Response Data:', response.data);
    }
    return response;
  },
  (error) => {
    if (logRequests) {
      console.error('[Response Error]', error);
    }
    return Promise.reject(error);
  }
);

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export const fetcher = (url :string) => axiosInstance.get(url).then((res) => res.data);

export default axiosInstance;