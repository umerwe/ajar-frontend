"use client";

import { Dispatch, SetStateAction } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import ChangePasswordForm from "../forms/changePassword";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

type ChangePasswordDialogProps = {
    data: any;
    label: string;
    openChangePassword: boolean;
    setOpenChangePassword: Dispatch<SetStateAction<boolean>>;
};

const ChangePasswordDialog = ({
    data,
    label,
    openChangePassword,
    setOpenChangePassword
}: ChangePasswordDialogProps) => {
    const Icon = data?.icon;
    const t = useTranslations("translation");

    return (
        <Dialog open={openChangePassword} onOpenChange={setOpenChangePassword}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-aqua" />
                        <span className="text-gray-900 font-medium">{label}</span>
                    </div>
                    <ChevronRight className="h-6 w-6 text-aqua" />
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("changePassword")}</DialogTitle>
                </DialogHeader>
                <ChangePasswordForm setOpen={setOpenChangePassword} />
            </DialogContent>
        </Dialog>
    );
};

export default ChangePasswordDialog;
