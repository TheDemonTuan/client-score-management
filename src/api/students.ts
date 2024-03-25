import http, { ApiSuccessResponse } from "@/lib/http";

export interface StudentResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  birth_day: Date;
  phone: string;
  gender: boolean;
  academic_year: number;
  department_id: number;
  class_id: string;
  grades: any[];
  registrations: any[];
}

//----------------------------------------------GET ALL----------------------------------------------\
export interface StudentGetAllParams {
  preload?: boolean;
  select?: string[];
}

export const studentGetAll = async (params?: StudentGetAllParams) =>
  http.get<ApiSuccessResponse<StudentResponse[]>>(`students`).then((res) => res.data);
