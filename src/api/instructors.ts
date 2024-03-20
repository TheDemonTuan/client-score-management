import http, { ApiSuccessResponse } from "@/lib/http";
import { ClassResponse } from "./classes";

export interface InstructorReponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  birth_day: Date;
  phone: string;
  gender: boolean;
  degree: string;
  department_id: number;
  classes: ClassResponse[];
}

//----------------------------------------------GET LIST----------------------------------------------
export const instructorGetList = async () =>
  http.get<ApiSuccessResponse<InstructorReponse[]>>("instructors").then((res) => res.data);

//----------------------------------------------CREATE----------------------------------------------
export interface InstructorCreateParams extends Omit<InstructorReponse, "id" | "classes"> {}

export const instructorCreate = async (params: InstructorCreateParams) =>
  http.post<ApiSuccessResponse<InstructorReponse>>("instructors", params).then((res) => res.data);

//----------------------------------------------UPDATE----------------------------------------------
export interface InstructorUpdateByIdParams extends Omit<InstructorReponse, "classes"> {}

export const instructorUpdateById = async (params: InstructorUpdateByIdParams) =>
  http
    .put<ApiSuccessResponse<InstructorReponse>>(`instructors/${params.id}`, params)
    .then((res) => res.data);

//----------------------------------------------DELETE----------------------------------------------

export interface InstructorDeleteByIdParams {
  id: string;
}

export const instructorDeleteById = async (params: InstructorDeleteByIdParams) =>
  http.delete<ApiSuccessResponse>(`instructors/${params.id}`).then((res) => res.data);
