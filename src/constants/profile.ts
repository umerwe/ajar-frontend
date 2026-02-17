import { Heart, Flag, ShieldCheck, Pencil, CalendarCheck, Lock, Wallet, Landmark } from "lucide-react"

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
        icon: Landmark,
        label: "Bank Account",
        href: "/bank-account",
    },
    {
        icon: Landmark,
        label: "Connect Bank Account",
        href: "/connect-bank-account",
    },
    {
        icon: Heart,
        label: "Favorites",
        href: "/favourites",
    },
    {
        icon: Pencil,
        label: "Add Documents"
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
    },
    {
        icon: Pencil,
        label: "Refund Request",
        href: "/refund",
    }
];