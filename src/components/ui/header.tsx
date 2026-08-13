"use client"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getStatusStyles } from "@/constants/booking";
import { ArrowLeft, Plus } from "lucide-react"
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface HeaderProps {
    status?: string
    title: string
    isBookingLoading?: boolean
    onAddClick?: () => void;
    addLabel?: string;
    backToHome?: boolean;
}

const Header = ({ status, title, isBookingLoading, onAddClick, addLabel, backToHome }: HeaderProps) => {
    const t = useTranslations("translation");
    const router = useRouter();

    const formattedStatus = (status: string) => {
        if (!status) return "";

        const normalizedStatus = status.toLowerCase();
        const statusLabels: Record<string, string> = {
            pending: t("pending"),
            approved: t("approved"),
            in_progress: t("inProgress"),
            completed: t("completed"),
            request_cancelled: t("requestCancelled"),
            booking_cancelled: t("bookingCancelled"),
            rejected: t("rejected"),
            expired: t("expired"),
            cancelled: t("cancelled"),
        };

        if (statusLabels[normalizedStatus]) {
            return statusLabels[normalizedStatus];
        }
        
        return status.replace(/_/g, " ");
    };

    return (
        <div className="flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 sm:gap-3">
                <Button variant="ghost" size="icon" className="bg-gray-100 rounded-lg" onClick={backToHome ? () => router.push('/') : () => router.back()}>
                    <ArrowLeft className="w-[18px] h-[18px]" />
                </Button>
                <h1 className="text-base sm:text-lg font-medium text-gray-900">{title}</h1>
            </div>

            {onAddClick && (
                <Button
                    onClick={onAddClick}
                    variant="destructive"
                    className='w-32 rounded-full h-9'
                >
                    <Plus className="w-4 h-4 mr-1" /> {addLabel}
                </Button>
            )}

            {isBookingLoading ? (
                <Skeleton className="h-7 w-20 sm:w-24 rounded-none bg-gray-200" />
            ) : (
                status && (
                    <div className={`${getStatusStyles(status)} px-3 py-1 text-xs sm:text-sm font-semibold capitalize`}>
                        {formattedStatus(status)}
                    </div>
                )
            )}
        </div>
    )
}

export default Header
