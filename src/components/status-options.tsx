"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import Dropdown from "@/components/ui/dropdown";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const statusOptions = ["Pending", "Approved", "Rejected", "Completed", "Cancelled"];

const StatusOptions = () => {
    const params = useParams();
    const statusParam = params.status as string;

    const getHref = (status: string) => `/booking/${status.toLowerCase()}`;
    const isActive = (status: string) => statusParam?.toLowerCase() === status?.toLowerCase();

    const mobileButton = (
        <button
            className="w-full flex items-center justify-between gap-3 px-5 py-3 
      rounded-lg border-2 bg-white hover:bg-gray-50 transition-colors
      duration-200 shadow-sm border-t-aqua border-r-aqua border-b-blue border-l-blue"
        >
            <span className="text-sm font-semibold text-[#01c89b]">
                {statusParam ? statusParam.charAt(0).toUpperCase() + statusParam.slice(1) : "All Status"}
            </span>
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        </button>
    );

    const mobileContent = (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="py-2">
                {statusOptions?.map((status, i) => {
                    const active = isActive(status);
                    return (
                        <Link
                            key={i}
                            href={getHref(status)}
                            className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${active && "bg-blue-50 border-r-4 border-aqua text-aqua"}`}
                        >
                            <span className={`text-sm font-medium ${active ? "text-aqua" : "text-gray-500"}`}>
                                {status}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="flex justify-between px-4 sm:px-6 md:px-9 my-4">
            {/* Desktop */}
            <div className="hidden md:flex flex-wrap gap-3 flex-grow">
                {statusOptions?.map((status, i) => {
                    const active = isActive(status);
                    return (
                        <Link
                            key={i}
                            href={getHref(status)}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full transition-colors duration-200 ${active
                                ? "text-aqua border-2 border-t-aqua border-r-aqua border-b-blue border-l-blue bg-transparent"
                                : "bg-gray-100 text-gray-400 border border-transparent hover:border-aqua hover:text-aqua"
                                }`}
                        >
                            <span className="text-sm font-semibold">{status}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Mobile */}
            <div className="md:hidden flex-grow max-w-50 relative">
                <Dropdown button={mobileButton}>{mobileContent}</Dropdown>
            </div>
        </div>
    );
};

export default StatusOptions;
