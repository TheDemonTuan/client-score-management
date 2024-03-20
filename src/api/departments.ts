import http, { ApiSuccessResponse } from "@/lib/http";
import { ClassResponse } from "./classes";
import { InstructorReponse } from "./instructors";
import { SubjectResponse } from "./subjects";

export interface DepartmentResponse {
  id: number;
  name: string;
  classes: ClassResponse[];
  students: any[];
  instructors: InstructorReponse[];
  subjects: SubjectResponse[];
}

//----------------------------------------------GET LIST----------------------------------------------
export const departmentGetList = async () =>
  http.get<ApiSuccessResponse<DepartmentResponse[]>>("departments").then((res) => res.data);

//----------------------------------------------GET BY ID----------------------------------------------
export interface DepartmentGetByIdParams {
  id: number;
}

export const departmentGetById = async (params: DepartmentGetByIdParams) =>
  http.get<ApiSuccessResponse<DepartmentResponse>>(`departments/${params.id}`).then((res) => res.data);

//----------------------------------------------CREATE----------------------------------------------
export interface DepartmentCreateParams {
  name: string;
}

export const departmentCreate = async (params: DepartmentCreateParams) =>
  http.post<ApiSuccessResponse<DepartmentResponse>>("departments", params).then((res) => res.data);

//----------------------------------------------UPDATE----------------------------------------------
export interface DepartmentUpdateByIdParams {
  id: number;
  name: string;
}

export const departmentUpdateById = async (params: DepartmentUpdateByIdParams) =>
  http
    .put<ApiSuccessResponse<DepartmentResponse>>(`departments/${params.id}`, params)
    .then((res) => res.data);

//----------------------------------------------DELETE----------------------------------------------
export interface DepartmentDeleteByIdParams {
  id: number;
}

export const departmentDeleteById = async (params: DepartmentDeleteByIdParams) =>
  http.delete<ApiSuccessResponse>(`departments/${params.id}`).then((res) => res.data);
