"use client";

import { CalendarDays, CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";

interface Extension {
    extensionDate: string | Date;
    priceDetails: {
        price: number;
    };
    status?: string;
}

interface Step {
    label: string;
    date: string | null;
    show: boolean;
    isStatic?: boolean;
    completed?: boolean;
    status?: string;
}

interface TimelineProps {
    property: {
        status: string;
        dates: {
            checkIn: string | Date;
            checkOut: string | Date;
        };
        bookingDates?: {
            handover?: string | Date;
            returnDate?: string | Date;
        };
        pricingMeta: {
            unit: "hour" | "day" | "month" | "year";
        };
        extensions: Extension[];
    };
}

const statusColorMap: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-teal-100 text-teal-700",
    rejected: "bg-red-100 text-red-700",
    request_cancelled: "bg-red-100 text-red-700",
    booking_cancelled: "bg-red-100 text-red-700",
    expired: "bg-gray-100 text-gray-500",
};

const Timeline = ({ property }: TimelineProps) => {
    const formatDate = (date: string | Date | undefined) => {
        if (!date) return null;
        const isHourly = property.pricingMeta.unit === "hour";
        return format(new Date(date), isHourly ? "dd MMM yyyy, hh:mm a" : "dd MMM yyyy");
    };

    const isCompleted = property.status === "completed";
    const isApproved = ["approved", "in_progress", "completed"].includes(property.status);

    const baseSteps: Step[] = [
        {
            label: "CHECK-IN",
            date: formatDate(property.dates.checkIn),
            show: true,
            completed: isApproved,
        },
        {
            label: "CHECK-OUT",
            date: formatDate(property.dates.checkOut),
            show: true,
            completed: isCompleted,
        },
        {
            label: "HANDOVER COMPLETED",
            date: formatDate(property.bookingDates?.handover),
            show: !!property.bookingDates?.handover,
            completed: !!property.bookingDates?.handover,
        },
        {
            label: "RETURN COMPLETED",
            date: formatDate(property.bookingDates?.returnDate),
            show: !!property.bookingDates?.returnDate,
            completed: !!property.bookingDates?.returnDate,
        },
    ];

    const extensionSteps: Step[] = (property.extensions || []).map((ext, index) => ({
        label: property.extensions.length > 1 ? `EXTENSION ${index + 1}` : "EXTENDED END",
        date: formatDate(ext.extensionDate),
        show: true,
        isStatic: true,
        completed: ext.status === "approved",
        status: ext.status,
    }));

    const timelineSteps = [...baseSteps, ...extensionSteps].filter((s) => s.show);

    const bookingStatusLabel = property.status.replace(/_/g, " ");
    const bookingStatusClass = statusColorMap[property.status] || "bg-gray-100 text-gray-500";

    return (
        <div className="w-full bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 sm:mb-8">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <CalendarDays className="w-5 h-5" />
                    <span>Timeline</span>
                </div>
            </div>

            {/* Timeline Steps */}
            <div className="relative flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap gap-4 md:gap-0">
                {/* Horizontal line for desktop */}
                <div className="absolute top-3 left-0 w-full h-[1px] bg-gray-100 -z-0 hidden lg:block" />

                {/* Vertical line for mobile */}
                <div className="absolute top-0 left-[11px] h-full w-[1px] bg-gray-100 -z-0 md:hidden" />

                {timelineSteps.map((step, index) => (
                    <div
                        key={index}
                        className="relative z-10 flex items-start gap-3 md:flex-col md:flex-1 md:items-start md:gap-2"
                    >
                        {/* Dot */}
                        <div className="shrink-0 mt-0.5 md:mt-0">
                            {step.completed ? (
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                            ) : (
                                <Circle className="w-6 h-6 text-gray-300" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-1">
                            <p className="text-xs font-semibold text-slate-400 tracking-wider">
                                {step.label}
                            </p>
                            <p className="text-sm font-bold text-slate-700">
                                {step.date || "—"}
                            </p>
                            {/* Extension status badge */}
                            {step.isStatic && step.status && (
                                <span className={`capitalize text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${statusColorMap[step.status] || "bg-gray-100 text-gray-500"}`}>
                                    {step.status.replace(/_/g, " ")}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;