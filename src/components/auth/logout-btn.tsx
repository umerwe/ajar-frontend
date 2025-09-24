"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  variant?: "menu" | "full";
}

const LogoutButton = ({ variant = "menu" }: LogoutButtonProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleClick = () => {
    queryClient.clear();
    localStorage.clear();
    sessionStorage.clear();

    router.replace("/auth/login");
  };

  if (variant === "full") {
    return (
      <Button
        variant="destructive"
        className="w-full sm:text-base py-5.5 flex items-center gap-2"
        onClick={handleClick}
      >
        <LogOut className="h-4 w-4" /> Log Out
      </Button>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="block px-4 py-2 text-sm transition-colors duration-150
       cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" /> Log Out
    </div>
  );
};

export default LogoutButton;
