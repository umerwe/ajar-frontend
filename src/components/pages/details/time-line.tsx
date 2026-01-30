"use client";

import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

interface Extension {
    extensionDate: string | Date;
    priceDetails: {
        price: number;
    };
}

interface Step {
    label: string;
    date: string | null;
    show: boolean;
    isStatic?: boolean;
}

interface TimelineProps {
    property: {
        dates: {
            checkIn: string | Date;
            checkOut: string | Date;
        };
        bookingDates?: {
            handover?: string | Date;
        };
        pricingMeta: {
            unit: "hour" | "day" | "month" | "year";
        };
        extensions: Extension[];
    };
}

const Timeline = ({ property }: TimelineProps) => {
    const formatDate = (date: string | Date | undefined) => {
        if (!date) return null;
        const isHourly = property.pricingMeta.unit === "hour";
        return format(
            new Date(date),
            isHourly ? "dd MMM yyyy, hh:mm a" : "dd MMM yyyy"
        );
    };

    const baseSteps: Step[] = [
        {
            label: "CHECK-IN",
            date: formatDate(property.dates.checkIn),
            show: true
        },
        {
            label: "CHECK-OUT",
            date: formatDate(property.dates.checkOut),
            show: true
        },
        {
            label: "HANDOVER COMPLETED",
            date: formatDate(property.bookingDates?.handover),
            show: !!property.bookingDates?.handover
        },
    ];

    const extensionSteps: Step[] = (property.extensions || []).map((ext, index) => ({
        label: property.extensions.length > 1 ? `EXTENSION ${index + 1}` : "EXTENDED END",
        date: formatDate(ext.extensionDate),
        show: true,
        isStatic: true,
    }));

    const timelineSteps = [...baseSteps, ...extensionSteps];

    return (
        <div className="w-full bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-8 text-slate-500 font-medium">
                <CalendarDays className="w-5 h-5" />
                <span>Timeline</span>
            </div>

            <div className="relative flex flex-wrap md:flex-nowrap justify-between gap-y-8">
                <div className="absolute top-3 left-0 w-full h-[1px] bg-gray-100 -z-0 hidden md:block" />

                {timelineSteps
                    .filter((step) => step.show)
                    .map((step, index) => (
                        <div key={index} className="relative z-10 flex gap-4 md:flex-col md:flex-1">
                            <div className={`w-6 h-6 rounded-full shrink-0 border-2 border-gray-200 bg-white flex items-center justify-center`} />

                            <div>
                                <p className="text-xs font-semibold text-slate-400 tracking-wider mb-1">
                                    {step.label}
                                </p>
                                <p className="text-sm font-bold text-slate-700">
                                    {step.date}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Timeline;