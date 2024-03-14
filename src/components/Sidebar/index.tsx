import Image from "next/image";
import Link from "next/link";
import MenuSide from "./menu";

const Sidebar = () => {
  return (
    <>
      <div className="flex items-center gap-2 h-16 border-b border-gray-300">
        <Link href={"/"}>
          <Image
            className="object-contain w-16 h-16"
            src="/logo.png"
            alt="logo"
            width={500}
            height={500}
            quality={100}
          />
        </Link>
        <div className="text-md">
          <h6 className="font-bold">T&Đ Score Manager</h6>
          <p className="text-xs">Hệ thống quản lý điểm sinh viên</p>
        </div>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <MenuSide />
      </div>
    </>
  );
};

export default Sidebar;
