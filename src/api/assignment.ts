import http, { ApiSuccessResponse } from "@/lib/http";

export interface AssignmentResponse {
  id: number;
  subject_id: string;
  instructor_id: string;
  created_at: string;
}

//----------------------------------------------GET LIST----------------------------------------------
export interface AssignmentGetAllParams {
  preload?: boolean;
  select?: string[];
}

export const assignmentGetAll = async (params?: AssignmentGetAllParams) =>
  http.get<ApiSuccessResponse<AssignmentResponse[]>>(`assignments`).then((res) => res.data);

//----------------------------------------------CREATE----------------------------------------------
export interface AssignmentCreateParams extends Pick<AssignmentResponse, "subject_id" | "instructor_id"> {}

export const assignmentCreate = async (params: AssignmentCreateParams) =>
  http.post<ApiSuccessResponse<AssignmentResponse>>("assignments", params).then((res) => res.data);

//----------------------------------------------DELETE----------------------------------------------
export interface AssignmentDeleteByIdParams extends Pick<AssignmentResponse, "id"> {}

export const assignmentDeleteById = async (params: AssignmentDeleteByIdParams) =>
  http.delete<ApiSuccessResponse>(`assignments/${params.id}`).then((res) => res.data);

//----------------------------------------------UPDATE----------------------------------------------

export interface AssignmentUpdateByIdParams extends Omit<AssignmentResponse, "created_at"> {}

export const assignmentUpdateById = async (params: AssignmentUpdateByIdParams) =>
  http.put<ApiSuccessResponse<AssignmentResponse>>(`assignments/${params.id}`, params).then((res) => res.data);
