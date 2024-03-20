import { TbCategory } from "react-icons/tb";
import { PiStudent } from "react-icons/pi";
import { SiBookstack, SiGoogleclassroom } from "react-icons/si";
import { LiaChalkboardTeacherSolid, LiaClipboardListSolid } from "react-icons/lia";
import { IoSchoolOutline } from "react-icons/io5";

export const MenuData = [
  {
    title: "Dashboard",
    link: "/",
    icon: IoSchoolOutline,
  },
  {
    title: "Sinh viên",
    link: "/sinh-vien",
    icon: PiStudent,
  },
  {
    title: "Giảng viên",
    link: "/giang-vien",
    icon: LiaChalkboardTeacherSolid ,
  },
  {
    title: "Khoa",
    link: "/khoa",
    icon: TbCategory,
  },
  {
    title: "Môn học",
    link: "/mon-hoc",
    icon: SiBookstack,
  },
  {
    title: "Lớp học",
    link: "/lop-hoc",
    icon: SiGoogleclassroom,
  },
  {
    title: "Điểm",
    link: "/diem",
    icon: LiaClipboardListSolid ,
  },
];
