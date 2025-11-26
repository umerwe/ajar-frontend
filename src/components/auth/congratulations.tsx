"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface CongratulationsDialogProps {
    open: boolean;
    title?: string;
    description?: string;
    redirectTo?: string;
    seconds?: number;
}

export default function CongratulationsDialog({
    open,
    title = "Congratulations!",
    description = "Your Account has been verified successfully.",
    redirectTo = "/auth/login",
    seconds = 5,
}: CongratulationsDialogProps) {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(seconds);

    useEffect(() => {
        if (!open) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
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
        <Dialog open={open} onOpenChange={() => {}} modal>
            <DialogContent
                showCloseButton={false}
                className="max-w-sm rounded-md text-center px-4 pt-3 pb-8"
                // Prevent closing on click outside
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                {/* Image */}
                <div className="mb-8 flex justify-center">
                    <Image
                        src="/congratulations-img.png"
                        alt="Congratulations"
                        width={200}
                        height={200}
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Header */}
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center font-bold text-black">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-custom text-sm max-w-100 mx-auto">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                {/* Redirect Info */}
                <p className="text-sm text-gray-custom mt-4">
                    Redirecting to login page in <strong>{timeLeft}s</strong>...
                </p>
            </DialogContent>
        </Dialog>
    );
}
