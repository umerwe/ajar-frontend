import MainLayout from "@/components/main-layout";
// import { SocketProvider } from "@/context/SocketContext";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
    {/* <SocketProvider> */}
        <MainLayout />
        <main className="flex-1">{children}</main>
    {/* </SocketProvider> */}
    </>
  );
}
