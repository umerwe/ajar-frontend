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
    },
    {
        icon: Globe,
        label: "Language",
    },
    {
        icon: Lock,
        label: "Change Password",
    },
    {
        icon: AlertTriangle,
        label: "Submit Dispute",
    },
    {
        icon: ShieldCheck,
        label: "Two-Factor Authentication",
    },
    {
        icon: Flag,
        label: "Report",
    },
    {
        icon: PhoneCall,
        label: "Emergency Assistance",
    },
];