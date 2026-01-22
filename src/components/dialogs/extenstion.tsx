"use client"

import { useState, useMemo } from "react"
import { Calendar, Clock, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Loader from "../common/loader"
import { cn } from "@/lib/utils"

export const ExtensionDialog = ({
    open,
    onOpenChange,
    onSubmit,
    minDate, // Current checkOut date string
    isPending,
    pricingUnit
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (date: string) => void
    minDate?: string,
    isPending?: boolean,
    pricingUnit?: string
}) => {
    const [date, setDate] = useState("")
    const isHourly = pricingUnit === "hour"

    const formatPreview = (val: string) => {
        if (!val) return isHourly ? "Select new date & time" : "Select new date";
        const dateObj = new Date(val);
        return dateObj.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            ...(isHourly && {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
        });
    }

    // STICT LOGIC: Always start from the next calendar day
    const formattedMinDate = useMemo(() => {
        if (!minDate) return "";
        const d = new Date(minDate);
        if (isNaN(d.getTime())) return "";

        // Move to the next day
        d.setDate(d.getDate() + 1);

        // Reset time to start of day (00:00) for the min attribute
        d.setHours(0, 0, 0, 0);

        // Convert to local ISO string for input[min] attribute
        const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);

        // If it's hourly, we need YYYY-MM-DDTHH:mm, otherwise YYYY-MM-DD
        return isHourly ? localDate.toISOString().slice(0, 16) : localDate.toISOString().split('T')[0];
    }, [minDate, isHourly]);

    const handleSubmit = () => {
        if (!date) return
        const isoDate = new Date(date).toISOString()
        onSubmit(isoDate);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none rounded-2xl">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold text-gray-900">Extend Rental</DialogTitle>
                    <DialogDescription className="text-gray-500 mt-1">
                        Select a new return date. Extensions must start from the day after your current checkout.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">
                            New Return {isHourly ? "Date & Time" : "Date"}
                        </Label>

                        <div
                            className={cn(
                                "relative flex items-center gap-4 bg-gray-100 rounded-xl p-4 cursor-pointer hover:bg-gray-200 transition-all border-2 border-transparent",
                                date && "border-header/20 bg-header/[0.02]"
                            )}
                            onClick={() => (document.getElementById('extension-picker') as any)?.showPicker()}
                        >
                            <div className="bg-white p-2.5 rounded-lg shadow-sm">
                                {isHourly ? <Clock className="w-5 h-5 text-header" /> : <Calendar className="w-5 h-5 text-header" />}
                            </div>

                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Available from {minDate ? new Date(new Date(minDate).setDate(new Date(minDate).getDate() + 1)).toLocaleDateString() : ""}
                                </span>
                                <span className={cn("text-base", date ? "text-gray-900" : "text-gray-400")}>
                                    {formatPreview(date)}
                                </span>
                            </div>

                            <input
                                id="extension-picker"
                                type={isHourly ? "datetime-local" : "date"}
                                value={date}
                                min={formattedMinDate}
                                onChange={(e) => setDate(e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!date || isPending}
                        className="w-full sm:flex-1 bg-header hover:bg-header/90 text-white rounded-xl py-6 shadow-md transition-all active:scale-[0.98]"
                    >
                        {isPending ? <Loader /> : "Confirm Extension"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}