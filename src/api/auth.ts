import http, { ApiSuccessResponse } from "@/lib/http";

// ----------------------------------------------LOGIN----------------------------------------------

export interface LoginAuthParams {
  username: string;
  password: string;
}

export const loginAuth = async (params: LoginAuthParams) =>
  http.post<ApiSuccessResponse<UserResponse>>("auth/login", params).then((res) => res.data);

// ----------------------------------------------Register----------------------------------------------

export interface RegisterAuthParams {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
}

export const registerAuth = async (params: RegisterAuthParams) =>
  http.post<ApiSuccessResponse<UserResponse>>("auth/register", params).then((res) => res.data);

// ----------------------------------------------Verify----------------------------------------------

export const verifyAuth = async () =>
  http.get<ApiSuccessResponse<UserResponse>>("auth/verify").then((res) => res.data);

// ----------------------------------------------LOGOUT----------------------------------------------

export interface LogoutAuthParams {
  uid: number;
}

export const logoutAuth = async (params: LogoutAuthParams) =>
  http.delete(`auth/logout/${params?.uid}`).then((res) => res.data);
