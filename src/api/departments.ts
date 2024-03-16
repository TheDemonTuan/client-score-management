import http, { ApiSuccessResponse } from "@/lib/http";

export interface DepartmentResponse {
  id: number;
  name: string;
  classes: ClassResponse[];
  students: any[];
  instructors: any[];
  subjects: SubjectResponse[];
}

//----------------------------------------------GET LIST----------------------------------------------
export const departmentGetList = async () =>
  http.get<ApiSuccessResponse<DepartmentResponse[]>>("departments").then((res) => res.data);

//----------------------------------------------CREATE----------------------------------------------
export interface DepartmentCreateParams {
  name: string;
}

export const departmentCreate = async (params: DepartmentCreateParams) =>
  http.post<ApiSuccessResponse<DepartmentResponse>>("departments", params).then((res) => res.data);

//----------------------------------------------UPDATE----------------------------------------------
export interface DepartmentUpdateParams {
  id: number;
  name: string;
}

export const departmentUpdate = async (params: DepartmentUpdateParams) =>
  http.put<ApiSuccessResponse<DepartmentResponse>>(`departments/${params.id}`, params).then((res) => res.data);
