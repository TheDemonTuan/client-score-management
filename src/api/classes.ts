interface ClassResponse {
  id: number;
  name: string;
  max_students: number;
  department_id: number;
  host_instructor_id: string;
  created_at: Date;
  updated_at: Date;
  students: any[];
}
