interface SubjectResponse {
  id: string;
  name: string;
  credits: number;
  process_percentage: number;
  midterm_percentage: number;
  final_percentage: number;
  department_id: number;
  created_at: Date;
  updated_at: Date;
  grades: any[];
  assignments: any[];
}
