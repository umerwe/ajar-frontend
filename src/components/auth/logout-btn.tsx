"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutButtonProps } from "@/types/auth";
import { signOut } from "next-auth/react";
import { ConfirmDialog } from "../dialogs/confirm-dialog"; // Path update karein

const LogoutButton = ({ variant = "menu", isPending }: LogoutButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    // Cleanup
    queryClient.clear();
    localStorage.clear();
    sessionStorage.clear();

    await signOut({ redirect: false });

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
          onClick={triggerDialog}
          className="px-4 py-2 text-sm transition-colors duration-150
            cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" /> Log Out
        </div>
      )}

      {/* Reusable Confirm Dialog */}
      <ConfirmDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleLogout}
        title="Confirm Logout"
        description="Are you sure you want to log out? You will need to login again to access your account."
        confirmText="Logout"
        variant="default"
      />
    </>
  );
};

export default LogoutButton;