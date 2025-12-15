"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRight, Pencil } from "lucide-react";
import EditProfileForm from "@/components/forms/edit-profile";

const EditProfileDialog = ({
    data,
    open,
    setOpen,
    user,
    documents,
    isLoading
}: EditProfileDialogProps) => {
    const [file, setFile] = useState<File | null>(null);
    const Icon = data?.icon;

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) setFile(null);
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

            <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 px-1">
                    
                    <div className="flex justify-center mb-4">
                        <div className="relative group h-24 w-24 rounded-full overflow-hidden bg-header flex items-center justify-center text-white text-2xl font-semibold">
                            {file ? (
                                <Image
                                    src={URL.createObjectURL(file)}
                                    alt="New preview"
                                    fill
                                    className="object-cover object-center"
                                />
                            ) : user?.profilePicture ? (
                                <Image
                                    src={process.env.NEXT_PUBLIC_API_BASE_URL + user?.profilePicture}
                                    alt={user?.name || "User"}
                                    fill
                                    className="object-cover object-center"
                                />
                            ) : (
                                <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
                            )}

                            <label
                                htmlFor="profile-upload"
                                className="absolute bottom-0 right-0 bg-white text-blue p-2 rounded-full shadow-md cursor-pointer opacity-90 hover:opacity-100 transition"
                            >
                                <Pencil className="h-4 w-4" />
                            </label>
                            <input
                                id="profile-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const selectedFile = e.target.files?.[0];
                                    if (selectedFile) {
                                        setFile(selectedFile);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <EditProfileForm
                        file={file}
                        setOpen={setOpen}
                        documents={documents}
                        user={user}
                        isLoading={isLoading}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfileDialog;