"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutButtonProps } from "@/types/auth";
import { LogoutDialog } from "../dialogs/logout-dialog";

const LogoutButton = ({ variant = "menu", isPending }: LogoutButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    // Cleanup logic
    queryClient.clear();
    localStorage.clear();
    sessionStorage.clear();

    // Final Redirect
    router.replace("/auth/login");
    setIsDialogOpen(false);
  };

  const triggerDialog = () => setIsDialogOpen(true);

  return (
    <>
      {variant === "full" ? (
        <Button
          variant="destructive"
          className="w-full sm:text-base py-5.5 flex items-center gap-2"
          onClick={triggerDialog}
          disabled={isPending}
        >
          <LogOut className="h-4 w-4" /> Log Out
        </Button>
      ) : (
        <div
          onClick={handleLogout}
          className="px-4 py-2 text-sm transition-colors duration-150
            cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" /> Log Out
        </div>
      )}

      {/* Separate Dialog Component */}
      <LogoutDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default LogoutButton;