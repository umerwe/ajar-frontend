"use client";

import { useChangePassword } from "@/hooks/useAuth";
import { DialogFooter } from "@/components/ui/dialog";
import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Loader from "@/components/common/loader";
import Input from "@/components/ui/auth-input";

interface ChangePasswordFormProps {
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export const ChangePasswordForm = ({ setOpen }: ChangePasswordFormProps) => {
    const { mutate, isPending } = useChangePassword();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;

        const formData = {
            oldPassword: (form.oldPassword as HTMLInputElement).value,
            newPassword: (form.newPassword as HTMLInputElement).value,
            confirmPassword: (form.confirmPassword as HTMLInputElement).value,
        };

        mutate(formData, {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
                <Label htmlFor="oldPassword">Old Password</Label>
                <Input
                    id="oldPassword"
                    name="oldPassword"
                    type="password"
                    placeholder="Enter Old Password"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Enter New Password"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    required
                />
            </div>
            <DialogFooter className="pt-4">
                <Button type="submit" variant="destructive" className="w-full" disabled={isPending}>
                    {isPending ? <Loader /> : "Change Password"}
                </Button>
            </DialogFooter>
        </form>
    );
};