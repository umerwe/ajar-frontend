"use client";

import SearchBar from "./search-bar/search-bar";
import ProfileDropdown from "./profile-dropdown";
import Brand from "./brand";
import { useLayoutVisibility } from "@/hooks/useLayoutVisibility";

export default function Navbar() {
  // const [mobileOpen, setMobileOpen] = useState(false);
  const { showSearchBar } = useLayoutVisibility();

  return (
    <div className="bg-header">
      <nav className="w-full px-7 md:px-11 py-4 flex items-center justify-between">
        <Brand />

        <div className="flex items-center space-x-4">
          {/* Desktop Navigation Links */}
          {/* <div className="hidden md:flex items-center space-x-10 mr-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-gray-200  transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div> */}

          <ProfileDropdown />

          {/* Mobile Menu Toggle */}
          {/* <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-header rounded-md p-1"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? (
              <XMarkIcon className="w-7 h-7" />
            ) : (
              <Bars3Icon className="w-7 h-7" />
            )}
          </button> */}
        </div>
      </nav>

      {/* Enhanced Mobile Navigation Menu */}
      {/* <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-96 opacity-100 border-t border-white/10" : "max-h-0 opacity-0 border-t-0"
        }`}
      >
        <div className="px-4 pb-4 text-center space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-white hover:text-gray-200 py-2 transition-colors duration-200"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div> */}

      {/* Search Bar */}
      {showSearchBar && <SearchBar />}
    </div>
  );
}