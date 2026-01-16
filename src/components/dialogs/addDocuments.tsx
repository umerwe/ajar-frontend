"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileUp, X, FileText } from "lucide-react";
import { toast } from "../ui/toast";
import Image from "next/image";
import { useUpdateUser } from "@/hooks/useAuth";

const AddDocumentDialog = ({ data, documents }: any) => {
    const [open, setOpen] = useState(false);
    const [selectedDocType, setSelectedDocType] = useState<string>("");
    const [docFile, setDocFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { mutate, isPending } = useUpdateUser();

    const Icon = data?.icon;

    useEffect(() => {
        if (docFile && docFile.type.startsWith("image/")) {
            const url = URL.createObjectURL(docFile);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreview(null);
    }, [docFile]);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            setDocFile(null);
            setSelectedDocType("");
            setPreview(null);
        }
    };

    const handleSubmit = async () => {
        if (!selectedDocType || !docFile) {
            toast({ title: "Error", description: "Missing fields", variant: "destructive" });
            return;
        }

        const formData = new FormData();
        formData.append(selectedDocType, docFile);

        mutate(formData, {
            onSuccess: () => {
                toast({ title: "Success", description: "Document uploaded" });
                handleOpenChange(false);
            },
            onError: () => {
                toast({ title: "Error", description: "Upload failed", variant: "destructive" });
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-aqua" />
                        <span className="text-gray-900 font-medium">{data.label}</span>
                    </div>
                    <ChevronRight className="h-6 w-6 text-aqua" />
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Document</DialogTitle>
                </DialogHeader>

                <div className="space-y-5 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Document Type</label>
                        <Select onValueChange={setSelectedDocType} value={selectedDocType}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {documents?.map((doc: any) => (
                                    <SelectItem key={doc.value} value={doc.value}>{doc.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">File</label>
                        {!docFile ? (
                            <div className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center hover:bg-gray-50 transition relative">
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                                />
                                <FileUp className="h-10 w-10 text-gray-300 mb-2" />
                                <span className="text-xs text-gray-400">Click to upload</span>
                            </div>
                        ) : (
                            <div className="relative border rounded-lg p-2 bg-gray-50">
                                {preview ? (
                                    <div className="relative h-40 w-full mb-2 rounded overflow-hidden">
                                        <Image src={preview} alt="preview" fill className="object-contain" />
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3 p-4">
                                        <FileText className="h-8 w-8 text-aqua" />
                                        <span className="text-sm font-medium truncate">{docFile.name}</span>
                                    </div>
                                )}
                                <Button
                                    variant="destructive" size="icon"
                                    className="absolute top-1 right-1 h-7 w-7 rounded-full"
                                    onClick={() => setDocFile(null)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            onClick={handleSubmit}
                            disabled={isPending || !docFile || !selectedDocType}
                            variant="destructive"
                        >
                            {isPending ? "Saving..." : "Save Document"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddDocumentDialog;