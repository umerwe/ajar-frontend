"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useAuth";

interface PrivateComponentProps {
  children: React.ReactNode;
}

const PrivateComponent: React.FC<PrivateComponentProps> = ({ children }) => {
  const router = useRouter();

  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      if (!user || user?.length === 0) {
        router.back();
      }
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-teal-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  else if (user?.email) {
    return <>{children}</>;
  }
};

export default PrivateComponent;
