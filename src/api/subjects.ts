import http, { ApiSuccessResponse } from "@/lib/http";

export interface SubjectResponse {
  id: string;
  name: string;
  credits: number;
  process_percentage: number;
  midterm_percentage: number;
  final_percentage: number;
  department_id: number;
  grades: any[];
  assignments: any[];
}


//----------------------------------------------GET LIST----------------------------------------------
export const subjectGetAll = async () =>
  http.get<ApiSuccessResponse<SubjectResponse[]>>("subjects").then((res) => res.data);

//----------------------------------------------CREATE----------------------------------------------
export interface SubjectCreateParams {
  name: string;
  credits: number;
  process_percentage: number;
  midterm_percentage: number;
  final_percentage: number;
  department_id: number;
}

export const subjectCreate = async (params: SubjectCreateParams) =>
  http.post<ApiSuccessResponse<SubjectResponse>>("subjects", params).then((res) => res.data);
