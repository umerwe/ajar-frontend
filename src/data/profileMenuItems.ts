import {  Lock, Heart, AlertTriangle, Flag, Globe, ShieldCheck, PhoneCall, Pencil } from "lucide-react"

export const profileMenuItems = [
  { label: "View profile", href: "/profile" },
  { label: "Rental History", href: "/rental-history" },
  { label: "Notification", href: "/notifications" },
  { label: "Favourites", href: "/favourites" },
  { label: "Chat", href: "/chat" },
  { label: "Emergency Assistance", href: "/emergency" },
  { label: "Help Center", href: "/help-center" },
  { label: "Reports", href: "/reports/report-issue" },
  { label: "Security Settings", href: "/security" }
];

export const profileItems = [
    {
        icon: Pencil,
        label: "Edit Profile",

    },
    {
        icon: Heart,
        label: "Favorites",
        href: "/favourites",
    },
    {
        icon: Globe,
        label: "Language",
        href: "/language",
    },
    {
        icon: Lock,
        label: "Change Password",
        href: "/change-password",
    },
    {
        icon: AlertTriangle,
        label: "Submit Dispute",
        href: "/submit-dispute",
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
        icon: PhoneCall,
        label: "Emergency Assistance",
        href: "/emergency",
    },
];