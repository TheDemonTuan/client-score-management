"use client";

import React, { useEffect } from "react";
import { MenuData } from "./menu-data";
import Link from "next/link";
import styles from "@/styles/sidebar.module.css";
import { cn } from "@/lib/cn";
import { usePathname } from "next/navigation";
import { usePathNameStore } from "@/stores/pathname-store";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@nextui-org/react";

const MenuSide = () => {
  const pathName = usePathname();
  const { current, changeTitle, changeCurrent } = usePathNameStore();
  const { authData, authIsPending } = useAuth();

  useEffect(() => {
    MenuData.forEach((item, index) => {
      if (pathName === item?.link || (index && pathName?.startsWith(item?.link))) {
        changeTitle(item?.title);
        changeCurrent(pathName);
      }
    });
  }, [changeCurrent, changeTitle, pathName]);

  if (authIsPending || !authData) return <Spinner label="Loading..." color="secondary" />;

  return (
    <ul className="menu menu-md text-gray-500 text-2xl gap-2">
      {MenuData.map((item, index) => (
        <li key={index} className={cn(current === item?.link && `${styles["active"]}`)}>
          <Link href={item?.link} title={item?.title}>
            <item.icon size={23} className="text-blue-400" />
            {item?.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MenuSide;
