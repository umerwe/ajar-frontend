"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  role: "user";
  iat: number;
  exp: number;
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (pathname.includes("auth")) {
          setIsVerified(true);
          return;
        }
        router.replace("/auth/login");
        return;
      }

      try {
        const decoded: DecodedToken = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now || decoded.role !== "user") {
          localStorage.removeItem("token");
          router.replace("/auth/login");
          return;
        }

        if (pathname.includes("auth")) {
          router.replace("/");
          return;
        }

        setIsVerified(true);
      } catch (error) {
        localStorage.removeItem("token");
        router.replace("/auth/login");
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (!isVerified) return null;

  return <>{children}</>;
}