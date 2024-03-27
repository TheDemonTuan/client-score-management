import http, { ApiSuccessResponse } from "@/lib/http";

export interface RegistrationResponse {
  id: number;
  subject_id: string;
  student_id: string;
}

//----------------------------------------------GET LIST----------------------------------------------
export interface RegistrationGetAllParams {
  preload?: boolean;
  select?: string[];
}

export const registrationGetAll = async (params?: RegistrationGetAllParams) =>
  http.get<ApiSuccessResponse<RegistrationResponse[]>>(`registrations`).then((res) => res.data);

//----------------------------------------------CREATE----------------------------------------------

export interface RegistrationCreateParams extends Pick<RegistrationResponse, "subject_id" | "student_id"> {}

export const registrationCreate = async (params: RegistrationCreateParams) =>
  http.post<ApiSuccessResponse<RegistrationResponse>>("registrations", params).then((res) => res.data);