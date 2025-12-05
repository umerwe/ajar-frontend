import MainLayout from "@/components/main-layout";
import { SessionProvider } from "next-auth/react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SessionProvider>
      <MainLayout />
      <main className="flex-1">{children}</main>
    </SessionProvider>
  );
}
