"use client";

import { CalendarDays, Clock } from "lucide-react";
import { format } from "date-fns"; // Recommended for easy date formatting

interface TimelineProps {
    property: {
        dates: {
            checkIn: string | Date;
            checkOut: string | Date;
        };
        bookingDates?: {
            handover?: string | Date;
        };
    };
}

const Timeline = ({ property }: TimelineProps) => {
    const formatDate = (date: string | Date | undefined) => {
        if (!date) return null;
        return format(new Date(date), "dd MMM yyyy, hh:mm a");
    };

    const timelineSteps = [
        {
            label: "CHECK-IN",
            date: formatDate(property.dates.checkIn),
            show: true,
            color: "bg-cyan-500", // Solid active color
        },
        {
            label: "CHECK-OUT",
            date: formatDate(property.dates.checkOut),
            show: true,
            color: "border-2 border-gray-200", // Default circle
        },
        {
            label: "HANDOVER COMPLETED",
            date: formatDate(property.bookingDates?.handover),
            show: !!property.bookingDates?.handover,
            color: "border-2 border-gray-200",
        },
        {
            label: "EXTENDED END",
            date: "28 Jan 2025, 10:00 AM", // Static as requested
            show: true,
            isStatic: true,
            color: "border-2 border-cyan-400",
        },
    ];

    return (
        <div className="w-full bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-8 text-slate-500 font-medium">
                <CalendarDays className="w-5 h-5" />
                <span>Timeline</span>
            </div>

            <div className="relative flex flex-wrap md:flex-nowrap justify-between gap-y-8">
                {/* The horizontal connecting line (hidden on mobile stacks) */}
                <div className="absolute top-3 left-0 w-full h-[1px] bg-gray-100 -z-0 hidden md:block" />

                {timelineSteps
                    .filter((step) => step.show)
                    .map((step, index) => (
                        <div key={index} className="relative z-10 flex gap-4 md:flex-col md:w-1/4">
                            {/* Status Circle */}
                            <div className={`w-6 h-6 rounded-full shrink-0 ${step.color} bg-white flex items-center justify-center`} />

                            {/* Content */}
                            <div className={`${step.isStatic ? "bg-cyan-50/50 p-3 rounded-lg border border-cyan-100 -mt-2" : ""}`}>
                                <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1">
                                    {step.label}
                                </p>
                                <p className="text-sm font-bold text-slate-700">
                                    {step.date}
                                </p>
                                {step.isStatic && (
                                    <p className="text-[10px] text-slate-500 mt-1">Lease extended by 2 days</p>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Timeline;