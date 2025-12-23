import { Heart, Flag, ShieldCheck, Pencil, CalendarCheck, Lock, Wallet } from "lucide-react"

export const profileMenuItems = [
    { label: "View Profile", href: "/profile" },
    { label: "Bookings", href: "/booking/all" },
    { label: "Favourites", href: "/favourites" },
    { label: "Chat", href: "/chat" },
    { label: "Reports", href: "/report" },
    { label: "Help Center", href: "/help-center" },
];

export const profileItems = [
    {
        icon: Pencil,
        label: "Edit Profile"
    },
    {
        icon: Wallet,
        label: "Wallet",
        href: "/wallet"
    },
    {
        icon: CalendarCheck,
        label: "Bookings",
        href: "/booking/pending",
    },
    {
        icon: Heart,
        label: "Favorites",
        href: "/favourites",
    },
    {
        icon: Lock,
        label: "Change Password",
        href: "/change-password",
    },
    {
        icon: ShieldCheck,
        label: "Two-Factor Authentication",
        href: "/two-factor",
    },
    {
        icon: Flag,
        label: "Report",
        href: "/report",
    }
];