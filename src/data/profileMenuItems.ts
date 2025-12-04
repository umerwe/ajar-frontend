import { Heart, Flag, ShieldCheck, Pencil, CalendarCheck } from "lucide-react"

export const profileMenuItems = [
    { label: "View Profile", href: "/profile" },
    { label: "Bookings", href: "/listing?status=pending" },
    { label: "Favourites", href: "/favourites" },
    { label: "Chat", href: "/chat" },
    { label: "Reports", href: "/reports/report-issue" },
    { label: "Help Center", href: "/help-center" },
];

export const profileItems = [
    {
        icon: Pencil,
        label: "Edit Profile"
    },
     {
        icon: CalendarCheck,
        label: "Bookings",
        href: "/listing?status=pending",
    },
    {
        icon: Heart,
        label: "Favorites",
        href: "/favourites",
    },
    // {
    //     icon: Globe,
    //     label: "Language",
    //     href: "/language",
    // },
    // {
    //     icon: Lock,
    //     label: "Change Password",
    //     href: "/change-password",
    // },
    // {
    //     icon: AlertTriangle,
    //     label: "Submit Dispute",
    //     href: "/submit-dispute",
    // },
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
    // {
    //     icon: PhoneCall,
    //     label: "Emergency Assistance",
    //     href: "/emergency",
    // },
];