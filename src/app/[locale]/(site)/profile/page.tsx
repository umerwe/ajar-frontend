"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Header from "@/components/ui/header";
import LogoutButton from "@/components/auth/logout-btn";
import Error from "@/components/common/error";
import SkeletonLoader from "@/components/common/skeleton-loader";
import { capitalizeWords } from "@/utils/capitalizeWords";
import { useUser } from "@/hooks/useAuth";
import { useGetUserDocument } from "@/hooks/useDocument";
import { profileItems } from "@/constants/profile";
import ChangePasswordDialog from "@/components/dialogs/changePassword";
import EditProfileDialog from "@/components/dialogs/editProfile";

export default function ProfilePage() {
    const { data: user = [], isLoading, isError } = useUser();
    const { data: documents = [] } = useGetUserDocument();

    const [openEditProfile, setOpenEditProfile] = React.useState(false);
    const [openChangePassword, setOpenChangePassword] = React.useState(false);

    if (isError) {
        return <Error />;
    }

    return (
        <>
            <div className="px-3 sm:px-7">
                <Header title="Profile" />
            </div>

            <div className="mx-auto max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-md my-6 md:my-10">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-white px-4 py-10">
                        {isLoading ? (
                            <SkeletonLoader variant="profile" />
                        ) : (
                            <div className="flex flex-col items-center space-y-3">
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
                            </div>
                        )}
                    </div>


                    <div className="bg-white mt-2 space-y-2 px-4">
                        {profileItems.map((item, index) => {
                            const Icon = item.icon;

                            if (item.label === "Edit Profile") {
                                return (
                                    <EditProfileDialog
                                        key={index}
                                        data={item}
                                        open={openEditProfile}
                                        setOpen={setOpenEditProfile}
                                        user={user}
                                        documents={documents}
                                        isLoading={isLoading}
                                    />
                                );
                            }

                            if (item.label === "Change Password") {
                                return (
                                    <ChangePasswordDialog
                                        key={index}
                                        data={item}
                                        openChangePassword={openChangePassword}
                                        setOpenChangePassword={setOpenChangePassword}
                                    />
                                );
                            }

                            return (
                                <Link
                                    href={item.href!}
                                    key={index}
                                    className="flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Icon className="h-5 w-5 text-aqua" />
                                        <span className="text-gray-900 font-medium">{item.label}</span>
                                    </div>
                                    <ChevronRight className="h-6 w-6 text-aqua" />
                                </Link>
                            );
                        })}
                    </div>

                    <div className="p-4 bg-white my-2">
                        <LogoutButton variant="full" />
                    </div>
                </div>
            </div>
        </>
    );
}