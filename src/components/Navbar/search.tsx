"use client";

import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { IoIosSearch } from "react-icons/io";
import { Input, Kbd, Skeleton } from "@nextui-org/react";

const SearchNav = () => {
  const { authCanUse } = useAuth();

  if (!authCanUse) return <Skeleton className="h-11 w-72 rounded-xl" />;

  return (
    <Input
      type="search"
      name="search"
      variant="faded"
      color="secondary"
      size="lg"
      startContent={<IoIosSearch size={26} />}
      endContent={<Kbd keys={["command"]}>K</Kbd>}
      placeholder="Search..."
    />
  );
};

export default SearchNav;
