import http, { ApiSuccessResponse } from "@/lib/http";

export interface ClassResponse {
  id: string;
  name: string;
  max_students: number;
  department_id: number;
  host_instructor_id: string;
  students: any[];
}

//----------------------------------------------GET LIST----------------------------------------------

export const classGetAll = async () => http.get<ApiSuccessResponse<ClassResponse[]>>("classes").then((res) => res.data);

//----------------------------------------------GET BY ID----------------------------------------------
export interface ClassGetByIdParams extends Pick<ClassResponse, "id"> {}

export const classGetById = async (params: ClassGetByIdParams) =>
  http.get<ApiSuccessResponse<ClassResponse>>(`classes/${params.id}`).then((res) => res.data);

//----------------------------------------------CREATE----------------------------------------------

export interface ClassCreateParams extends Omit<ClassResponse, "id" | "students"> {}

export const classCreate = async (params: ClassCreateParams) =>
  http.post<ApiSuccessResponse<ClassResponse>>("classes", params).then((res) => res.data);

//----------------------------------------------UPDATE BY ID----------------------------------------------
export interface ClassUpdateByIdParams extends Omit<ClassResponse, "department_id" | "students"> {}

export const classUpdateById = async (params: ClassUpdateByIdParams) =>
  http.put<ApiSuccessResponse<ClassResponse>>(`classes/${params.id}`, params).then((res) => res.data);

//----------------------------------------------DELETE BY ID----------------------------------------------
export interface ClassDeleteByIdParams extends Pick<ClassResponse, "id"> {}

export const classDeleteById = async (params: ClassDeleteByIdParams) =>
  http.delete<ApiSuccessResponse>(`classes/${params.id}`).then((res) => res.data);
