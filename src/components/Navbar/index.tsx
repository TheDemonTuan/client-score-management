"use client";

import React from "react";
import { UserNav } from "./user";
import SearchNav from "./search";
import { CiMenuFries } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { useSideBarStore } from "@/stores/sidebar-store";

const Navbar = () => {
  const { isOpen, setIsOpen } = useSideBarStore();

  return (
    <>
      <div className="lg_max:fixed flex items-center justify-between w-full h-16 shadow-navbar lg:rounded-lg bg-white">
        <div className="flex items-center px-4">
          <label className="lg:hidden swap swap-rotate">
            <input type="checkbox" onClick={() => setIsOpen(!isOpen)} />
            <CiMenuFries size={30} className="swap-off fill-current" />
            <IoMdClose size={30} className="swap-on fill-current" />
          </label>
          <SearchNav />
        </div>
        <div className="flex items-center pr-4">
          <UserNav />
        </div>
      </div>
      <div className="mt-16 lg:hidden"></div>
    </>
  );
};

export default Navbar;
