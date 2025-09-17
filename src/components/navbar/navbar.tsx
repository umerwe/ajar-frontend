"use client";

import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import SearchBar from "./search-bar/search-bar";
import ProfileDropdown from "./profile-dropdown";
import { navLinks } from "@/data/navlinks";
import Brand from "./brand";
import { useLayoutVisibility } from "@/hooks/useLayoutVisibility";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { showSearchBar } = useLayoutVisibility();

  return (
    <div className="bg-header">
      <nav className="w-full px-7 md:px-11 py-4 flex items-center justify-between">
        <Brand />

        <div className="flex items-center space-x-4">
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-10 mr-10">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-white hover:underline transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <ProfileDropdown />

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-header rounded-md p-1"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? (
              <XMarkIcon className="w-7 h-7" />
            ) : (
              <Bars3Icon className="w-7 h-7" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4 border-t border-white/10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-white hover:underline py-2 transition-colors duration-200"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Search Bar */}
      {showSearchBar && <SearchBar />}
    </div>
  );
}