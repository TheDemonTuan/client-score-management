"use client";

import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { usePathNameStore } from "@/stores/pathname-store";

const TopContent = () => {
  const { split, title } = usePathNameStore();
  return (
    <div className="md:flex items-center justify-between space-y-2">
      <h2 className="text-4xl font-bold tracking-tight capitalize text-blue-500">{title}</h2>
      <div className="flex items-center space-x-2">
        <Breadcrumbs variant="bordered" underline="hover">
          <BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
          {split.map((item, index) => (
            <BreadcrumbItem
              className="capitalize"
              key={item}
              href={`/${split.slice(0, index + 1).join("/")}`}
            >
              {item}
            </BreadcrumbItem>
          ))}
        </Breadcrumbs>
      </div>
    </div>
  );
};

export default TopContent;
