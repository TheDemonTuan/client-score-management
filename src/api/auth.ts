import http, { ApiSuccessResponse } from "@/lib/http";

// ----------------------------------------------LOGIN----------------------------------------------

export interface AuthLoginParams {
  username: string;
  password: string;
}

export const authLogin = async (params: AuthLoginParams) =>
  http.post<ApiSuccessResponse<UserResponse>>("auth/login", params).then((res) => res.data);

// ----------------------------------------------Register----------------------------------------------

export interface AuthRegisterParams {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
}

export const authRegister = async (params: AuthRegisterParams) =>
  http.post<ApiSuccessResponse<UserResponse>>("auth/register", params).then((res) => res.data);

// ----------------------------------------------Verify----------------------------------------------

export const authVerify = async () =>
  http.get<ApiSuccessResponse<UserResponse>>("auth/verify").then((res) => res.data);

// ----------------------------------------------LOGOUT----------------------------------------------

export interface AuthLogoutParams {
  uid: number;
}

export const authLogout = async (params: AuthLogoutParams) =>
  http.delete(`auth/logout/${params?.uid}`).then((res) => res.data);
