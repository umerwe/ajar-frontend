"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "@/components/MyImage";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

export default function CongratulationsDialog({
    open,
    title,
    description,
    redirectTo = "/",
    seconds = 4,
}: CongratulationsDialogProps) {
    const router = useRouter();
    const t = useTranslations("translation");
    const [timeLeft, setTimeLeft] = useState(seconds);

    useEffect(() => {
        if (!open) return;

        setTimeLeft(seconds);

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const timeout = setTimeout(() => {
            router.replace(redirectTo);
        }, seconds * 1000);

        localStorage.removeItem("email");

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [open, router, seconds, redirectTo]);

    return (
        <Dialog open={open} onOpenChange={() => { }} modal>
            <DialogContent
                showCloseButton={false}
                className="max-w-sm rounded-md text-center px-4 pt-3 pb-8"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <div className="flex justify-center items-center mx-auto">
                    <Image
                        src="/congratulations.png"
                        alt="Congratulations"
                        width={200}
                        height={200}
                        className="object-contain"
                        priority
                    />
                </div>

                <DialogHeader>
                    <DialogTitle className="text-2xl text-center font-bold text-black">
                        {title || t("congratulations")}
                    </DialogTitle>
                    <DialogDescription className="text-gray-custom text-sm max-w-100 mx-auto">
                        {description || t("accountVerifiedSuccessfully")}
                    </DialogDescription>
                </DialogHeader>

                <p className="text-sm text-gray-custom mt-4">
                    {t("redirectingHomeIn")} <strong>{timeLeft}s</strong>...
                </p>
            </DialogContent>
        </Dialog>
    );
}
