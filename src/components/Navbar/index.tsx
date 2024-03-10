import React from "react";
import { CiSearch } from "react-icons/ci";

const Navbar = () => {
  return (
    <>
      <div className="flex items-center justify-between h-16 shadow-2xl rounded-lg bg-white">
        <div className="flex items-center px-4">
          <label className="lg:hidden swap swap-rotate">
            <input type="checkbox" />
            <svg
              className="swap-off fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>
            <svg
              className="swap-on fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
            </svg>
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <CiSearch size={24} />
            <input type="search" className="grow" placeholder="Search" />
            <kbd className="kbd kbd-sm">ctrl</kbd>
            <kbd className="kbd kbd-sm">K</kbd>
          </label>
        </div>
        <div className="flex items-center pr-4">
          <button className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 19l-7-7 7-7m5 14l7-7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
