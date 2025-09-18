import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const statusOptions = ["pending", "accepted", "rejected", "completed", "cancelled"];

export const StatusOptions = () => {
    const searchParams = useSearchParams();
    const status = searchParams.get("status");
    const getHref = (status: string) => `/listing?status=${status}`;

    const isActive = (x: string) => status === x;
    return (
        <div className="flex flex-wrap gap-3 px-4 sm:px-5 pt-6">
            {statusOptions.map((status, i) => {
                const active = isActive(status);
                return (
                    <Link
                        key={i}
                        href={getHref(status)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-full transition-colors duration-200 ${active
                            ? "text-aqua border-2 border-t-aqua border-r-aqua border-b-blue border-l-blue bg-transparent"
                            : "bg-gray-100 text-gray-400 border border-transparent hover:border-aqua hover:text-aqua"
                            }`}
                    >
                        <Image
                            width={20}
                            height={20}
                            src={"/ai-logo.png"}
                            alt={`${status} icon`}
                            className="w-5 h-5"
                        />
                        <span
                            className={`text-sm font-semibold ${active ? "text-aqua" : "text-gray-500"
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}