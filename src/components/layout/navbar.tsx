"use client";

import SearchBar from "./search-bar";
import ProfileDropdown from "../dropdown";
import Brand from "../brand";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();
  return (
    <div className="bg-header">
      <nav className="w-full px-7 md:px-11 py-4 flex items-center justify-between">
        <Brand />

        <div className="flex items-center space-x-4">
          <ProfileDropdown />
        </div>
      </nav>
      {
        path === "/en" &&
        <SearchBar />
      }
    </div>
  );
}