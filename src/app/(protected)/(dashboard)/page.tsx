"use client";

import { ClassResponse, classGetAll } from "@/api/classes";
import { DepartmentResponse, departmentGetAll } from "@/api/departments";
import { InstructorReponse, instructorGetAll } from "@/api/instructors";
import { StudentResponse, studentGetAll } from "@/api/students";
import { SubjectResponse, subjectGetAll } from "@/api/subjects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiSuccessResponse } from "@/lib/http";
import { useSuspenseQueries } from "@tanstack/react-query";
import { ImBooks } from "react-icons/im";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiStudent } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { TbCategory } from "react-icons/tb";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  const [departmentsQuery, instructorsQuery, studentsQuery, subjectsQuery, classesQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["departments"],
        queryFn: async () => await departmentGetAll(),
        select: (res: ApiSuccessResponse<DepartmentResponse[]>) => res?.data.length,
      },
      {
        queryKey: ["instructors"],
        queryFn: async () => await instructorGetAll(),
        select: (res: ApiSuccessResponse<InstructorReponse[]>) => res?.data.length,
      },
      {
        queryKey: ["students"],
        queryFn: async () => await studentGetAll(),
        select: (res: ApiSuccessResponse<StudentResponse[]>) => res?.data.length,
      },
      {
        queryKey: ["subjects"],
        queryFn: async () => await subjectGetAll(),
        select: (res: ApiSuccessResponse<SubjectResponse[]>) => res?.data.length,
      },
      {
        queryKey: ["classes"],
        queryFn: async () => await classGetAll(),
        select: (res: ApiSuccessResponse<ClassResponse[]>) => res?.data.length,
      },
    ],
  });

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số lượng giảng viên</CardTitle>
            <LiaChalkboardTeacherSolid size={20} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{instructorsQuery?.data}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số lượng sinh viên</CardTitle>
            <PiStudent size={20} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{studentsQuery?.data}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số lượng môn học</CardTitle>
            <ImBooks size={20} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{subjectsQuery?.data}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số lượng khoa</CardTitle>
            <TbCategory size={20} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{departmentsQuery?.data}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số lượng lớp</CardTitle>
            <SiGoogleclassroom size={20} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{classesQuery?.data}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Thống kê</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Bar
              data={{
                labels: ["Giảng viên", "Sinh viên", "Môn học", "Khoa", "Lớp"],
                datasets: [
                  {
                    label: "Tổng số",
                    backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                    data: [
                      instructorsQuery?.data,
                      studentsQuery?.data,
                      subjectsQuery?.data,
                      departmentsQuery?.data,
                      classesQuery?.data,
                    ],
                  },
                ],
              }}
            />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            {/* <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription> */}
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
    </>
  );
}
