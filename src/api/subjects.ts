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
export const subjectGetList = async () =>
  http.get<ApiSuccessResponse<SubjectResponse[]>>("subjects").then((res) => res.data);
