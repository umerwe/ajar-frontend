import PrivateComponent from "@/components/private-component";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <PrivateComponent>
        <main className="flex-1">{children}</main>
    </PrivateComponent>
  );
}
