import { Heart, ShieldCheck, Pencil, CalendarCheck, Lock, Wallet, Landmark, HelpCircle } from "lucide-react"

export const profileMenuItems = [
    { key: "viewProfile", href: "/profile" },
    { key: "bookings", href: "/booking/all" },
    { key: "favorites", href: "/favourites" },
    { key: "chat", href: "/chat" },
    { key: "termsAndConditions", href: "#" },
    { key: "helpCenter", href: "/help-center" },
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
