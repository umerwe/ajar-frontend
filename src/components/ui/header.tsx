"use client"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getStatusStyles } from "@/constants/booking";
import { capitalizeWords } from "@/utils/capitalizeWords";
import { ArrowLeft, Plus } from "lucide-react"
import { useRouter } from "next/navigation";

interface HeaderProps {
    status?: string
    title: string
    isBookingLoading?: boolean
    onAddClick?: () => void;
}

const Header = ({ status, title, isBookingLoading, onAddClick }: HeaderProps) => {
    const router = useRouter();

    const formattedStatus =
        status?.toLowerCase() === "in_progress"
            ? "In Progress"
            : capitalizeWords(status || "");

    return (
        <div className="flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 sm:gap-3">
                <Button variant="ghost" size="icon" className="bg-gray-100 rounded-lg" onClick={title === "Chat" ? () => router.push('/') : () => router.back()}>
                    <ArrowLeft className="w-[18px] h-[18px]" />
                </Button>
                <h1 className="text-base sm:text-lg font-medium text-gray-900">{title}</h1>
            </div>

            {title === "Bank Accounts" && (
                <Button
                    onClick={onAddClick}
                    variant="destructive"
                    className='w-32 rounded-full h-9'
                >
                    <Plus className="w-4 h-4 mr-1" /> Add Bank
                </Button>
            )}

            {isBookingLoading ? (
                <Skeleton className="h-7 w-20 sm:w-24 rounded-none bg-gray-200" />
            ) : (
                status && (
                    <div className={`${getStatusStyles(status)} px-3 py-1 text-xs sm:text-sm font-semibold`}>
                        {formattedStatus}
                    </div>
                )
            )}
        </div>
    )
}

export default Header