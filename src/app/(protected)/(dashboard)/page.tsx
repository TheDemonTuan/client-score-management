"use client";

import { departmentGetAll } from "@/api/departments";
import { instructorGetAll } from "@/api/instructors";
import { subjectGetAll } from "@/api/subjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSuspenseQueries } from "@tanstack/react-query";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiStudent } from "react-icons/pi";
import { SiBookstack } from "react-icons/si";

export default function DashboardPage() {
  const [departmentsQuery, instructorsQuery, subjectsQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["departments"],
        queryFn: async () => await departmentGetAll(),
      },
      {
        queryKey: ["instructors"],
        queryFn: async () => await instructorGetAll(),
      },
      {
        queryKey: ["subjects"],
        queryFn: async () => await subjectGetAll(),
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
            <div className="text-2xl font-bold">+{instructorsQuery?.data?.data?.length}</div>
            {/* <p className="text-xs text-muted-foreground">+???</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số lượng môn học</CardTitle>
            <SiBookstack size={20} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{subjectsQuery?.data?.data?.length}</div>
            {/* <p className="text-xs text-muted-foreground">+180.1% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số lượng khoa</CardTitle>
            <PiStudent size={20} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{departmentsQuery?.data?.data?.length}</div>
            {/* <p className="text-xs text-muted-foreground">+180.1% from last month</p> */}
          </CardContent>
        </Card>
      </div>
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2"></CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div> */}
    </>
  );
}
