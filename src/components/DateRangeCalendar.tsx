"use client"
import { DayPicker } from "react-day-picker"
import { format, parseISO, setHours, setMinutes, startOfDay } from "date-fns"
import { useState, useRef, useEffect, useMemo } from "react"
import "react-day-picker/dist/style.css"
import { Calendar, Clock } from "lucide-react"

interface BlockedSlot {
    from: string; // "HH:mm"
    to: string;   // "HH:mm"
}

interface BlockedDateSlot {
    date: string; // "YYYY-MM-DD"
    slots: BlockedSlot[];
}

const DateRangeCalendar = ({
    isHourly,
    blockedDates,
    blockedSlots,
    onRangeChange,
    startDate,
    endDate,
    onMonthChange,
}: {
    isHourly: boolean
    blockedDates: string[]
    blockedSlots: BlockedDateSlot[]
    onRangeChange: (start: string, end: string) => void
    startDate: string
    endDate: string
    isLoadingDates?: boolean
    onMonthChange?: (month: string) => void
}) => {
    const [openCalendar, setOpenCalendar] = useState<"start" | "end" | null>(null)
    const [startRange, setStartRange] = useState<Date | undefined>(undefined)
    const [endRange, setEndRange] = useState<Date | undefined>(undefined)
    const [startTime, setStartTime] = useState("09:00")
    const [endTime, setEndTime] = useState("10:00")
    const [error, setError] = useState<string | null>(null)

    const startRef = useRef<HTMLDivElement>(null)
    const endRef = useRef<HTMLDivElement>(null)

    const localBlockedIntervals = useMemo(() => {
        if (!blockedSlots) return [];
        return blockedSlots.flatMap(dayEntry => 
            dayEntry.slots.map(slot => ({
                start: new Date(`${dayEntry.date}T${slot.from}:00Z`),
                end: new Date(`${dayEntry.date}T${slot.to}:00Z`)
            }))
        );
    }, [blockedSlots]);

    const timeSlots = useMemo(() => {
        return Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    }, []);

    // ✅ Updated to include "1 hour ahead" logic for today's date
    const isTimeBlocked = (timeStr: string, selectedDate: Date) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const checkTime = setMinutes(setHours(startOfDay(selectedDate), hours), minutes);
        
        // 1. Check Backend Blocked Slots
        const isBackendBlocked = localBlockedIntervals.some(interval => checkTime >= interval.start && checkTime < interval.end);
        if (isBackendBlocked) return true;

        // 2. Check "1 Hour Ahead" logic if selected date is today
        const now = new Date();
        const isToday = format(selectedDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
        
        if (isToday) {
            // If current time is 11:09, now.getHours() is 11. 
            // We block all hours <= 11, so the first available is 12.
            if (hours <= now.getHours()) return true;
        }

        return false;
    };

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (startRef.current && !startRef.current.contains(e.target as Node) &&
                endRef.current && !endRef.current.contains(e.target as Node)) {
                setOpenCalendar(null)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const formatLocal = (dateStr: string) => {
        if (!dateStr) return ""
        const date = new Date(dateStr)
        if (isHourly) {
            return date.toLocaleString("en-US", {
                month: "short", day: "numeric", year: "numeric",
                hour: "2-digit", minute: "2-digit", hour12: true,
            })
        }
        const [year, month, day] = dateStr.split("T")[0].split("-").map(Number)
        return new Date(year, month - 1, day).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
        })
    }

    const handleTimeSelect = (time: string, type: "start" | "end") => {
        setError(null);
        if (type === "start" && startRange) {
            const localStart = new Date(`${format(startRange, "yyyy-MM-dd")}T${time}:00`);
            if (endDate && localStart >= new Date(endDate)) {
                setError("Start must be before end");
                return;
            }
            setStartTime(time);
            onRangeChange(localStart.toISOString(), endDate || "");
            setOpenCalendar(null);
        } else if (type === "end" && endRange) {
            const localEnd = new Date(`${format(endRange, "yyyy-MM-dd")}T${time}:00`);
            if (startDate && localEnd <= new Date(startDate)) {
                setError("End must be after start");
                return;
            }
            setEndTime(time);
            onRangeChange(startDate || "", localEnd.toISOString());
            setOpenCalendar(null);
        }
    };

    const handleDateSelect = (day: Date | undefined, type: "start" | "end") => {
        if (!day) return;
        setError(null);

        if (type === "start") {
            setStartRange(day);
            if (!isHourly) {
                onRangeChange(format(day, "yyyy-MM-dd"), endDate || "");
                setOpenCalendar(null);
            }
        } else {
            setEndRange(day);
            if (!isHourly) {
                onRangeChange(startDate || "", format(day, "yyyy-MM-dd"));
                setOpenCalendar(null);
            }
        }
    };

    const sharedDayPickerProps = {
        disabled: [{ before: new Date() }, ...blockedDates.map(d => parseISO(d))],
        onMonthChange: (month: Date) => onMonthChange?.(format(month, "yyyy-MM")),
        classNames: {
            selected: "!bg-aqua !text-white !rounded-lg",
            today: "!font-bold !text-teal-600",
        },
    }

    return (
        <div className="col-span-2 grid grid-cols-2 gap-4">
            <div className="relative" ref={startRef}>
                <div className={`bg-gray-100 rounded-lg p-3 cursor-pointer hover:bg-gray-200 ${startDate ? "border border-teal-400" : ""}`}
                     onClick={() => setOpenCalendar(openCalendar === "start" ? null : "start")}>
                    <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-xs font-medium text-gray-900">Lease Start</span>
                    </div>
                    <p className="text-sm text-gray-500">{startDate ? formatLocal(startDate) : "Select Date"}</p>
                </div>

                {openCalendar === "start" && (
                    <div className="absolute top-full mt-2 left-0 z-50 bg-white border rounded-2xl shadow-xl p-4 w-[320px]">
                        <DayPicker mode="single" selected={startRange} onSelect={(d) => handleDateSelect(d, "start")} {...sharedDayPickerProps} />
                        {isHourly && startRange && (
                            <div className="border-t pt-3">
                                <label className="text-xs font-semibold text-gray-500 mb-2 block">Select Start Time</label>
                                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                    {timeSlots.map((time) => {
                                        const blocked = isTimeBlocked(time, startRange);
                                        return (
                                            <button
                                                key={time}
                                                type="button"
                                                disabled={blocked}
                                                onClick={() => handleTimeSelect(time, "start")}
                                                className={`text-[11px] py-1.5 rounded-md border transition-all ${
                                                    blocked ? "bg-gray-50 text-gray-300 line-through border-gray-100 cursor-not-allowed" :
                                                    startTime === time ? "bg-aqua text-white border-teal-500" : "hover:border-teal-500 text-gray-700"
                                                }`}
                                            >
                                                {format(parseISO(`2000-01-01T${time}`), "h aa")}
                                            </button>
                                        );
                                    })}
                                </div>
                                {error && <p className="text-red-500 text-[10px] mt-2">{error}</p>}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="relative" ref={endRef}>
                <div className={`bg-gray-100 rounded-lg p-3 cursor-pointer hover:bg-gray-200 ${endDate ? "border border-teal-400" : ""}`}
                     onClick={() => setOpenCalendar(openCalendar === "end" ? null : "end")}>
                    <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-xs font-medium text-gray-900">Lease End</span>
                    </div>
                    <p className="text-sm text-gray-500">{endDate ? formatLocal(endDate) : "Select Date"}</p>
                </div>

                {openCalendar === "end" && (
                    <div className="absolute top-full mt-2 right-0 z-50 bg-white border rounded-2xl shadow-xl p-4 w-[320px]">
                        <DayPicker mode="single" selected={endRange} onSelect={(d) => handleDateSelect(d, "end")} {...sharedDayPickerProps} />
                        {isHourly && endRange && (
                            <div className="border-t pt-3">
                                <label className="text-xs font-semibold text-gray-500 mb-2 block">Select End Time</label>
                                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                    {timeSlots.map((time) => {
                                        const blocked = isTimeBlocked(time, endRange);
                                        return (
                                            <button
                                                key={time}
                                                type="button"
                                                disabled={blocked}
                                                onClick={() => handleTimeSelect(time, "end")}
                                                className={`text-[11px] py-1.5 rounded-md border transition-all ${
                                                    blocked ? "bg-gray-50 text-gray-300 line-through border-gray-100 cursor-not-allowed" :
                                                    endTime === time ? "bg-aqua text-white border-teal-500" : "hover:border-teal-500 text-gray-700"
                                                }`}
                                            >
                                                {format(parseISO(`2000-01-01T${time}`), "h aa")}
                                            </button>
                                        );
                                    })}
                                </div>
                                {error && <p className="text-red-500 text-[10px] mt-2">{error}</p>}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default DateRangeCalendar