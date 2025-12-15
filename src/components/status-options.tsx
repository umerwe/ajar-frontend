"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import Dropdown from "@/components/ui/dropdown";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { formatStatus } from "@/utils/formatStatus";
import { statusOptions } from "../constants/booking";

const StatusOptions = () => {
    const params = useParams();
    const statusParam = (params.status as string) || "all";

    const slugify = (str: string) => {
        if (!str) return "";
        if (str.toLowerCase() === "in progress") return "in_progress";
        return str.toLowerCase();
    };

    const getHref = (status: string) => `/booking/${slugify(status)}`;

    const isActive = (status: string) => {
        return slugify(status) === slugify(statusParam);
    };

    const getCurrentLabel = () => {
        if (!statusParam || slugify(statusParam) === "all") return "All Status";
        return formatStatus(statusParam);
    };

    const mobileButton = (
        <button
            className="w-full max-w-38 flex items-center justify-between gap-3 px-4 py-2.5 
            rounded-lg border-2 border-t-aqua border-r-aqua border-b-blue
          border-l-blue bg-white hover:bg-gray-50 transition-all
            duration-200 shadow-sm group"
        >
            <span className="text-sm font-semibold text-[#01c89b]">
                {getCurrentLabel()}
            </span>
            <ChevronDownIcon className="w-4 h-4 text-aqua group-hover:text-[#01c89b] transition-colors" />
        </button>
    );

    const mobileContent = (
        <div className="absolute top-full max-w-38 left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="max-h-[60vh] overflow-y-auto py-1">
                {statusOptions.map((status, i) => {
                    const active = isActive(status);
                    return (
                        <Link
                            key={i}
                            href={getHref(status)}
                            className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors duration-150 border-l-4 ${active
                                    ? "bg-blue-50 border-l-aqua text-aqua"
                                    : "border-l-transparent text-gray-600"
                                }`}
                        >
                            <span className={`text-sm font-medium ${active ? "text-aqua" : ""}`}>
                                {status === "All" ? "All Status" : status}
                            </span>
                            {active && <span className="h-2 w-2 rounded-full bg-aqua" />}
                        </Link>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="flex justify-between">
            {/* Desktop View */}
            <div className="hidden md:flex flex-wrap gap-3 flex-grow">
                {statusOptions.map((status, i) => {
                    const active = isActive(status);
                    return (
                        <Link
                            key={i}
                            href={getHref(status)}
                            className={`
                                flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border
                                ${active
                                    ? "text-aqua border-t-aqua border-r-aqua border-b-blue border-l-blue bg-white shadow-sm"
                                    : "bg-gray-100/80 text-gray-500 border-transparent hover:bg-white hover:border-aqua/50 hover:text-aqua hover:shadow-sm"
                                }
                            `}
                        >
                            {status}
                        </Link>
                    );
                })}
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex-grow w-full relative">
                <Dropdown button={mobileButton}>
                    {mobileContent}
                </Dropdown>
            </div>
        </div>
    );
};

export default StatusOptions;