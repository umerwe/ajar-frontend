"use client";

import { useState } from "react";
import {
    AlertCircle,
    ArrowUpFromLine,
    ListChecks,
    ChevronDown,
    DollarSign,
    FileText,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { useBooking } from "@/hooks/useBooking";
import { capitalizeWords } from "@/utils/capitalizeWords";
import { useSendReport } from "@/hooks/useReport";
import Image from "next/image";
import { Listing } from "@/types/listing";

export default function ReportForm() {
    const { data } = useBooking();
    const { mutate, isPending } = useSendReport();
    const bookings = data?.data?.bookings

    const [rental, setRental] = useState("");
    const [issueType, setIssueType] = useState("");
    const [booking, setBooking] = useState("");
    const [damagedCharges, setDamagedCharges] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            const url = URL.createObjectURL(uploadedFile);
            setFilePreviewUrl(url);
        }
        event.target.value = '';
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (filePreviewUrl) {
            URL.revokeObjectURL(filePreviewUrl);
        }
        setFilePreviewUrl(null);
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("booking", booking);
        formData.append("issueType", issueType);
        formData.append("damagedCharges", damagedCharges);
        formData.append("rentalText", rental);
        if (file) formData.append("attachments", file);

        mutate(formData, {
            onSuccess: () => {
                resetForm();
            }
        });
    };

    const resetForm = () => {
        setRental("");
        setIssueType("");
        setBooking("");
        setDamagedCharges("");
        setFile(null);
        if (filePreviewUrl) {
            URL.revokeObjectURL(filePreviewUrl);
        }
        setFilePreviewUrl(null);
    };

    return (
        <div>
            <Header title="Report Issue" />
            <div className="max-w-6xl mx-auto pt-6">
                <h1 className="text-lg md:text-xl font-semibold text-gray-800">Report Issue</h1>
                <p className="text-xs md:text-sm text-gray-400">Please fill the following details to report an issue</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Booking
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-aqua">
                                <FileText size={18} />
                            </span>
                            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-aqua">
                                <ChevronDown size={22} />
                            </span>
                            <select
                                className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 bg-gray-50 text-sm text-gray-600 focus:outline-none appearance-none"
                                value={booking}
                                onChange={(e) => setBooking(e.target.value)}
                            >
                                <option value="">Select Booking</option>

                                {bookings?.map((b: { _id: string; marketplaceListingId: Listing }) => (
                                    <option key={b._id} value={b._id}>
                                        {typeof b.marketplaceListingId === "object"
                                            ? capitalizeWords(b.marketplaceListingId.name)
                                            : ""}
                                    </option>
                                ))}

                            </select>

                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Issue Type
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-aqua">
                                <AlertCircle size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Enter the issue type"
                                value={issueType}
                                onChange={(e) => setIssueType(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-sm text-gray-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Damaged Charges
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-aqua">
                                <DollarSign size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Enter amount (e.g., 150.00)"
                                value={damagedCharges}
                                onChange={(e) => setDamagedCharges(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-sm text-gray-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rental Text
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-aqua">
                                <ListChecks size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Enter the Rental Text"
                                value={rental}
                                onChange={(e) => setRental(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-sm text-gray-600 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Upload */}
                <div className="mt-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Image/Video
                    </label>

                    <label className={`relative flex flex-col items-center justify-center h-28 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer ${filePreviewUrl ? 'p-2' : ''}`}>

                        {filePreviewUrl ? (
                            <>
                                <Image
                                    src={filePreviewUrl}
                                    alt="Selected attachment preview"
                                    width={200}
                                    height={200}
                                    className="object-contain h-full w-full rounded-lg"
                                />

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleRemoveFile();
                                    }}
                                    className="absolute top-2 right-2 bg-white rounded-full p-1 text-gray-600 hover:text-red-500 shadow-md transition-colors z-10"
                                >
                                    <X size={16} />
                                </button>
                            </>
                        ) : (
                            <>
                                <ArrowUpFromLine className="text-aqua mb-2" size={20} />
                                <span className="text-sm text-gray-custom">Upload</span>
                            </>
                        )}

                        <input type="file" onChange={handleUpload} hidden />
                    </label>
                </div>

                <div className="flex items-center justify-center mt-10">
                    <Button
                        variant="destructive"
                        className="px-30 py-5"
                        onClick={handleSubmit}
                        disabled={isPending}
                    >
                        {isPending ? "Submitting..." : "Submit Report"}
                    </Button>
                </div>

            </div>
        </div>
    );
}