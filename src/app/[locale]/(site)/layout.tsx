import MainLayout from "@/components/main-layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
        <MainLayout />
        <main className="flex-1">{children}</main>
    </>
  );
}
