import http from "@/lib/http";

// ----------------------------------------------LOGIN----------------------------------------------

export interface LoginAuthBody {
  username: string;
  password: string;
}

export const loginAuth = async (params: LoginAuthBody) =>
  http.post<UserResponse>("auth/login", params).then((res) => res.data);

// ----------------------------------------------Register----------------------------------------------

export interface RegisterAuthBody {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
}

export const registerAuth = async (params: RegisterAuthBody) =>
  http.post<UserResponse>("auth/register", params).then((res) => res.data);

// ----------------------------------------------Verify----------------------------------------------

export const verifyAuth = async () => http.get<UserResponse>("auth/verify").then((res) => res.data);


// ----------------------------------------------LOGOUT----------------------------------------------
export const logoutAuth = async () => http.delete("auth/logout").then((res) => res.data);