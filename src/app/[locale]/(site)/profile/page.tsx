"use client"

import Header from "@/components/pages/listing-details/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/hooks/useAuth";
import { ChevronRight, Pencil } from "lucide-react"
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

function Progress({ value, className }: { value: number; className?: string }) {
    return (
        <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
            <div
                className="bg-aqua h-2 rounded-full transition-all duration-300"
                style={{ width: `${value}%` }}
            />
        </div>
    )
}

const capitalizeWord = (word: string) => {
    return word
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
};

export default function SettingsPage() {
    const { data: user = [], isLoading, isError } = useUser();

    const [file, setFile] = React.useState<File | null>(null);
    const [open, setOpen] = React.useState(false); // control dialog

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">Loading...</div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center text-red-500">Error loading settings</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-3 sm:px-7">
                <Header title="Settings" />
            </div>

            <div className="mx-auto max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                {/* Profile Section */}
                <div className="bg-white px-4 py-6">
                    <div className="flex flex-col items-center space-y-3">
                        <Avatar className="h-20 w-20 overflow-hidden rounded-full">
                            {user?.profilePicture ? (
                                <AvatarImage
                                    src={process.env.NEXT_PUBLIC_API_BASE_URL + user?.profilePicture}
                                    alt="user-img"
                                    className="w-full h-full object-cover object-center"
                                />
                            ) : null}
                            <AvatarFallback className="text-2xl font-semibold bg-header text-white">
                                {user?.name.charAt(0).toUpperCase() || ""}
                            </AvatarFallback>
                        </Avatar>


                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {capitalizeWord(user?.name) || "User"}
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

                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Edit Profile</DialogTitle>
                                        </DialogHeader>

                                        {/* Avatar with Edit Icon Overlay */}
                                        <div className="flex justify-center mb-4">
                                            <div className="relative group">
                                                <Avatar className="h-24 w-24 overflow-hidden rounded-full">
                                                    {file ? (
                                                        <AvatarImage
                                                            src={URL.createObjectURL(file)}
                                                            alt="New preview"
                                                            className="w-full h-full object-cover object-center"
                                                        />
                                                    ) : user?.profilePicture ? (
                                                        <AvatarImage
                                                            src={process.env.NEXT_PUBLIC_API_BASE_URL + user?.profilePicture}
                                                            alt={user?.name || "User"}
                                                            className="w-full h-full object-cover object-center"
                                                        />
                                                    ) : (
                                                        <AvatarFallback className="text-2xl font-semibold bg-header text-white">
                                                            {user?.name?.charAt(0).toUpperCase() || ""}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>

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

                                        {/* Pass setOpen so form can close dialog */}
                                        <EditProfileForm file={file} setOpen={setOpen} />
                                    </DialogContent>
                                </Dialog>
                            )
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
                        )
                    })}
                </div>

                {/* Bottom Button */}
                <div className="p-4 bg-white mt-2">
                    <LogoutButton variant="full" />
                </div>

                <div className="h-8"></div>
            </div>
        </div>
    )
}
