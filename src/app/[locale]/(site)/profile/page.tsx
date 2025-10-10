"use client";

import Header from "@/components/pages/listing-details/header";
import Image from "next/image";
import { useUser } from "@/hooks/useAuth";
import { ChevronRight, Pencil } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import EditProfileForm from "@/components/forms/edit-profile";
import React from "react";
import { profileItems } from "@/data/profileMenuItems";
import LogoutButton from "@/components/auth/logout-btn";
import Error from "@/components/common/error";
import SkeletonLoader from "@/components/common/skeleton-loader";
import { capitalizeWords } from "@/utils/capitalizeWords";
import { Progress } from "@/components/ui/progress";
import { useGetUserDocument } from "@/hooks/useDocument";

export default function SettingsPage() {
    const { data: user = [], isLoading, isError } = useUser();
    const { data: documents = [], isLoading: documentsLoading } = useGetUserDocument();
    const [file, setFile] = React.useState<File | null>(null);
    const [open, setOpen] = React.useState(false);

    if (isError) {
        return <Error />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-3 sm:px-7">
                <Header title="Settings" />
            </div>

            <div className="mx-auto max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                {/* Profile Section */}
                <div className="bg-white px-4 py-6">
                    {isLoading ? (
                        <SkeletonLoader variant="profile" />
                    ) : (
                        <div className="flex flex-col items-center space-y-3">
                            {/* Profile Image with Fallback */}
                            <div className="relative h-20 w-20 rounded-full overflow-hidden">
                                {user?.profilePicture ? (
                                    <Image
                                        src={process.env.NEXT_PUBLIC_API_BASE_URL + user?.profilePicture}
                                        alt="user-img"
                                        fill
                                        className="object-cover object-center"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-aqua text-white font-semibold text-2xl">
                                        {user?.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>
                            <div className="text-center">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {capitalizeWords(user?.name) || "User"}
                                </h2>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>

                            {/* Progress Section */}
                            <div className="w-full mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-1 h-4 bg-teal-500 rounded-full"></div>
                                        <span className="text-lg font-semibold text-gray-900">50%</span>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                </div>
                                <Progress value={50} className="h-2 mb-2" />
                                <p className="text-xs text-gray-500">
                                    You are 50% steps away to complete your profile
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Settings Menu */}
                <div className="bg-white mt-2 space-y-2">
                    {profileItems.map((item, index) => {
                        const Icon = item.icon;

                        if (item.label === "Edit Profile") {
                            return (
                                <Dialog key={index} open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors">
                                            <div className="flex items-center space-x-3">
                                                <Icon className="h-5 w-5 text-aqua" />
                                                <span className="text-gray-900 font-medium">{item.label}</span>
                                            </div>
                                            <ChevronRight className="h-6 w-6 text-aqua" />
                                        </div>
                                    </DialogTrigger>

                                    <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
                                        <DialogHeader className="flex-shrink-0">
                                            <DialogTitle>Edit Profile</DialogTitle>
                                        </DialogHeader>

                                        {/* Scrollable Content */}
                                        <div className="overflow-y-auto flex-1 px-1">
                                            {/* Profile Upload with Preview */}
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

                                                    {/* Edit Icon Overlay */}
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

                                            {/* Edit Profile Form */}
                                            <EditProfileForm 
                                                file={file} 
                                                setOpen={setOpen} 
                                                documents={documents}
                                                documentsLoading={documentsLoading}
                                            />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            );
                        }

                        return (
                            <div
                                key={index}
                                className="flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon className="h-5 w-5 text-aqua" />
                                    <span className="text-gray-900 font-medium">{item.label}</span>
                                </div>
                                <ChevronRight className="h-6 w-6 text-aqua" />
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Button */}
                <div className="p-4 bg-white mt-2">
                    <LogoutButton variant="full" />
                </div>

                <div className="h-8"></div>
            </div>
        </div>
    );
}