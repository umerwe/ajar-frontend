import { Heart, ShieldCheck, Pencil, CalendarCheck, Lock, Wallet, Landmark, HelpCircle } from "lucide-react"

export const profileMenuItems = [
    { label: "View Profile", href: "/profile" },
    { label: "Bookings", href: "/booking/all" },
    { label: "Favourites", href: "/favourites" },
    { label: "Chat", href: "/chat" },
    { label: "Terms & Conditions", href: "#" },
    { label: "Help Center", href: "/help-center" },
];

export const profileItems = [
    {
        icon: Pencil,
        key: "editProfile",
        label: "Edit Profile"
    },
    {
        icon: Wallet,
        key: "transactions",
        label: "Transactions",
        href: "/transactions"
    },
    {
        icon: CalendarCheck,
        key: "bookings",
        label: "Bookings",
        href: "/booking/all",
    },
    {
        icon: Landmark,
        key: "connectBankAccount",
        label: "Connect Bank Account",
        href: "/connect-bank-account",
    },
    {
        icon: Heart,
        key: "favorites",
        label: "Favorites",
        href: "/favourites",
    },
    {
        icon: HelpCircle,
        key: "faqs",
        label: "FAQs",
        href: "/faqs",
    },
    {
        icon: Pencil,
        key: "addDocuments",
        label: "Add Documents"
    },
    {
        icon: Lock,
        key: "changePassword",
        label: "Change Password",
        href: "/change-password",
    },
    {
        icon: ShieldCheck,
        key: "twoFactorAuthentication",
        label: "Two-Factor Authentication",
        href: "/two-factor",
    },
    {
        icon: Pencil,
        key: "refundRequest",
        label: "Refund Request",
        href: "/refund",
    }
];
