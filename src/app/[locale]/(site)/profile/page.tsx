"use client"

import Header from "@/components/pages/listing-details/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/useAuth";
import { ChevronRight, UserCheck, Lock, Heart, AlertTriangle, Shield, Flag, Phone } from "lucide-react"

function Progress({ value, className }: { value: number; className?: string }) {
    return (
        <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
            <div className="bg-aqua h-2 rounded-full transition-all duration-300" style={{ width: `${value}%` }} />
        </div>
    )
}
const capitalizeWord = (word: string) => {
    return word
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) 
        .join(" ");
};

const settingsItems = [
    {
        icon: UserCheck,
        label: "Switch to Leaser Mode",
        color: "text-teal-500",
    },
    {
        icon: Lock,
        label: "Change Password",
        color: "text-teal-500",
    },
    {
        icon: Heart,
        label: "Favorites",
        color: "text-teal-500",
    },
    {
        icon: AlertTriangle,
        label: "Submit Dispute",
        color: "text-teal-500",
    },
    {
        icon: Shield,
        label: "Two-Factor Authentication",
        color: "text-teal-500",
    },
    {
        icon: Flag,
        label: "Report",
        color: "text-teal-500",
    },
    {
        icon: Phone,
        label: "Emergency Assistance",
        color: "text-teal-500",
    },
]

export default function SettingsPage() {
    const { data: user = [], isLoading, isError } = useUser();

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
                <Header
                    title="Settings"
                />
            </div>
            <div className="mx-auto max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                {/* Profile Section */}
                <div className="bg-white px-4 py-6">
                    <div className="flex flex-col items-center space-y-3">
                        <Avatar className="h-20 w-20">
                            {user?.profilePicture ? (
                                <AvatarImage src={user.profilePicture} alt={user?.name || "User"} />
                            ) : null}
                            <AvatarFallback className="text-2xl font-semibold bg-header text-white">
                                {user?.name.charAt(0).toUpperCase() || ""}
                            </AvatarFallback>
                        </Avatar>

                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-gray-900">{capitalizeWord(user?.name) || "User"}</h2>
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
                            <p className="text-xs text-gray-500">You are 50% steps away to complete your profile</p>
                        </div>
                    </div>
                </div>

                {/* Settings Menu */}
                <div className="bg-white mt-2 space-y-2">
                    {settingsItems.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={index}
                                className="flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon className={`h-5 w-5 ${item.color}`} />
                                    <span className="text-gray-900 font-medium">{item.label}</span>
                                </div>
                                <ChevronRight className="h-6 w-6 text-aqua" />
                            </div>
                        )
                    })}
                </div>

                {/* Bottom Button */}
                <div className="p-4 bg-white mt-2">
                    <Button
                        variant="destructive"
                        className="w-full py-5.5"
                    >
                        Switch to Leaser Mode
                    </Button>
                </div>

                {/* Bottom spacing for mobile */}
                <div className="h-8"></div>
            </div>
        </div>
    )
}