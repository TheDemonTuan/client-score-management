import { TbCategory, TbSettingsCode } from "react-icons/tb";
import { PiStudent } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { LiaChalkboardTeacherSolid, LiaClipboardListSolid } from "react-icons/lia";
import { IoSchoolOutline } from "react-icons/io5";
import { ImBooks } from "react-icons/im";
import { GiArchiveRegister } from "react-icons/gi";

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
    icon: LiaChalkboardTeacherSolid,
  },
  {
    title: "Khoa",
    link: "/khoa",
    icon: TbCategory,
  },
  {
    title: "Môn học",
    link: "/mon-hoc",
    icon: ImBooks,
    children: [
      {
        title: "Quản lý",
        link: "/quan-ly",
        icon: TbSettingsCode,
      },
      {
        title: "Đăng ký",
        link: "/dang-ky",
        icon: GiArchiveRegister,
      },
    ],
  },
  {
    title: "Lớp học",
    link: "/lop-hoc",
    icon: SiGoogleclassroom,
    children: [
      {
        title: "Quản lý",
        link: "/quan-ly",
        icon: TbSettingsCode,
      },
      {
        title: "Đăng ký",
        link: "/dang-ky",
        icon: GiArchiveRegister,
      },
    ],
  },
  {
    title: "Điểm",
    link: "/diem",
    icon: LiaClipboardListSolid,
  },
];
