"use client"
import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { ArrowUpFromLine, ClipboardCheckIcon } from "lucide-react";

const IDVerificationForm: React.FC = () => {
    const [selectedDocument, setSelectedDocument] = useState<string>("Driver's license");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const documentTypes: string[] = [
        "Driver's license",
        "Passport",
        "National ID Card",
        "State ID",
    ];

    const handleDocumentSelect = (document: string): void => {
        setSelectedDocument(document);
        setIsDropdownOpen(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const handleSubmit = (): void => {
        console.log("ID Verification data:", {
            documentType: selectedDocument,
            uploadedFile: uploadedFile,
        });
    };

    return (
        <div className="bg-white rounded-md shadow-2xl px-4 py-8 sm:py-6 sm:px-7 lg:-mt-13 w-full lg:w-[330px]">
            {/* Header */}
            <div className="mb-8 flex flex-col items-center text-center">
                <h1 className="text-xl font-bold text-gray-900 mb-1">ID Verification</h1>
                <p className="text-gray-500 text-sm max-w-69">Enter the Following details to Verify your Identity</p>
            </div>

            {/* Form */}
            <div className="space-y-3">
                {/* Document Type Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Document Type
                    </label>
                    <div className="relative">
                        <ClipboardCheckIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-aqua" />
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full pl-9 pr-12 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-aqua focus:border-transparent text-sm text-left text-gray-400"
                        >
                            {selectedDocument}
                            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
                                {documentTypes.map((document) => (
                                    <button
                                        key={document}
                                        type="button"
                                        onClick={() => handleDocumentSelect(document)}
                                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl focus:outline-none focus:bg-gray-50"
                                    >
                                        {document}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Upload Document Field */}
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Upload Document
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            id="document-upload"
                            onChange={handleFileUpload}
                            className="hidden"
                            accept="image/*,.pdf"
                        />
                        <label
                            htmlFor="document-upload"
                            className="w-full h-32 border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-teal-300 hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2">
                                <ArrowUpFromLine className="h-6 w-6 text-aqua" />
                            </div>
                            <span className="text-sm text-gray-600 font-medium">
                                {uploadedFile ? uploadedFile.name : "Upload"}
                            </span>
                            {!uploadedFile && (
                                <span className="text-xs text-gray-400 mt-1">
                                    Click to select file
                                </span>
                            )}
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    variant="destructive"
                    onClick={handleSubmit}
                    className="w-full shadow-lg"
                >
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default IDVerificationForm;
