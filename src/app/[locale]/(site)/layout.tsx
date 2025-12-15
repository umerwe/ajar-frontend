"use client";

import Container from "@/components/container";
import Navbar from "@/components/layout/navbar";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isHelpCenter = pathname === "/en/help-center";
  
  return (
    <SessionProvider>
      <Navbar />
      <Container className={isHelpCenter ? "mb-0 px-0 max-w-full" : "max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-6 md:mb-10 pt-4 md:pt-6"}>
        <main className="flex-1">{children}</main>
      </Container>
    </SessionProvider>
  );
}
