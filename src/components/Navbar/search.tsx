'use client'

import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { IoIosSearch } from "react-icons/io";
import { Skeleton } from "../ui/skeleton";

const SearchNav = () => {
  const {authIsLoading} = useAuth();

  if(authIsLoading) return <Skeleton className="h-11 w-56" />;

  return (
    <div className="max-w-md mx-auto">
      <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white border overflow-hidden">
        <div className="grid place-items-center h-full w-12 text-gray-300">
          <IoIosSearch size={24} />
        </div>

        <input
          className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
          type="text"
          id="search"
          placeholder="Search something.."
        />
      </div>
    </div>
  );
};

export default SearchNav;
