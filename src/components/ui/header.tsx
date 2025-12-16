"use client"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getStatusStyles } from "@/constants/booking";
import { capitalizeWords } from "@/utils/capitalizeWords";
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation";

interface HeaderProps {
    status?: string
    title: string
    isBookingLoading?: boolean
}

const Header = ({ status, title, isBookingLoading }: HeaderProps) => {
    const router = useRouter();

    const formattedStatus =
        status?.toLowerCase() === "in_progress"
            ? "In Progress"
            : capitalizeWords(status || "");

    return (
        <div className="flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 sm:gap-3">
                <Button variant="ghost" className="bg-gray-100" onClick={title === "Chat" ? () => router.push('/') : () => router.back()}>
                    <ArrowLeft style={{ width: '18px', height: '18px' }} />
                </Button>
                <h1 className="text-md sm:text-lg font-semibold text-gray-900">{title}</h1>
            </div>

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