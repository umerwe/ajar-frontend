"use client";

import SearchBar from "./search-bar";
import ProfileDropdown from "../dropdown";
import Brand from "../brand";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/hooks/useAuth";
import { Button } from "../ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: user } = useUser();

  const isHomePage =
    (pathname === "/en" || pathname === "/") &&
    searchParams.toString() === "";

  return (
    <div className="bg-header">
      <nav className="w-full px-7 md:px-11 py-4 flex items-center justify-between">
        <Brand />
        <div className="flex items-center space-x-4">
          {
            user ?
              <ProfileDropdown />
              :
              <Button
                variant="link"
                className="h-0"
                onClick={() => router.push('/auth/login')}
              >
                Sign In
              </Button>
          }
        </div>
      </nav>

      {isHomePage && <SearchBar />}
    </div>
  );
}
