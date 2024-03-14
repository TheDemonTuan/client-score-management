"use client";

import React, { useEffect } from "react";
import { MenuData } from "./menu-data";
import Link from "next/link";
import styles from "@/styles/sidebar.module.css";
import { cn } from "@/lib/cn";
import { usePathname } from "next/navigation";
import { usePathNameStore } from "@/stores/pathname-store";

const MenuSide = () => {
  const pathName = usePathname();
  const { change } = usePathNameStore();

  useEffect(() => {
    change(pathName);
  }, [change, pathName]);

  return (
    <ul className="menu menu-md text-gray-500 text-2xl gap-2">
      {MenuData.map((item, index) => (
        <li
          key={index}
          className={cn(
            (pathName === item?.link || (index && pathName?.startsWith(item?.link))) &&
              `${styles["active"]}`
          )}
        >
          <Link href={item?.link} title={item?.title}>
            <item.icon size={22} />
            {item?.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MenuSide;
