import { getJwt } from "@/app/actions";
import axios, { AxiosError } from "axios";

export interface ApiSuccessResponse<T = null | []> {
  code: number;
  message: string;
  data: T;
}

interface ErrorResponse {
  code: number;
  message: string;
  data: null;
}

const http = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URI}/api/`,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  async (config) => {
    config.headers["Authorization"] = `Bearer ${await getJwt()}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export type ApiErrorResponse = AxiosError<ErrorResponse>;

export default http;
