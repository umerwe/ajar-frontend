"use client";

import { useState } from "react";
import {
    AlertCircle,
    ArrowUpFromLine,
    ListChecks,
    ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/pages/listing-details/header";

export interface ReportFormProps {
    formTitle: string;
    uploadLabel: string;
}

export default function ReportForm({
    formTitle,
    uploadLabel,
}: ReportFormProps) {
    const [rental, setRental] = useState("");
    const [issueType, setIssueType] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (uploadedFile) setFile(uploadedFile);
    };

    return (
        <div>
            <Header title={formTitle} />

            <div className="max-w-6xl mx-auto py-6">
                <h1 className="text-2xl font-bold text-gray-800">{formTitle}</h1>
                <p className="text-sm text-gray-400 mt-1">Please fill the following details to report an issue</p>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rental
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-aqua">
                                <ListChecks size={18} />
                            </span>
                            <span className="pointer-events-none absolute right-5 top-5 -translate-y-1/2 text-aqua">
                                <ChevronDown size={22} />
                            </span>
                            <select
                                className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 bg-gray-50 text-sm text-gray-600 focus:outline-none appearance-none"
                                value={rental}
                                onChange={(e) => setRental(e.target.value)}
                            >
                                <option value="">Select Rental</option>
                                <option value="apartment">Apartment</option>
                                <option value="villa">Villa</option>
                                <option value="car">Car</option>
                            </select>
                        </div>
                    </div>

                    {/* Issue Type */}
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
                </div>

                {/* Upload */}
                <div className="mt-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {uploadLabel}
                    </label>

                    <label className="flex flex-col items-center justify-center h-28 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer">
                        <ArrowUpFromLine className="text-aqua mb-2" size={20} />
                        <span className="text-sm text-gray-custom">Upload</span>
                        <input type="file" onChange={handleUpload} hidden />
                    </label>

                    {file && (
                        <p className="text-xs mt-2 text-gray-500">Selected: {file.name}</p>
                    )}
                </div>

                {/* Submit */}
                <div className="flex items-center justify-center mt-10">
                    <Button variant="destructive" className="px-30 py-5">
                        Submit Report
                    </Button>
                </div>
            </div>
        </div>
    );
}
