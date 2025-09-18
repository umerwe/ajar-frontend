"use client";
import Image from "next/image";
import { BellIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import LogoutButton from "../auth/logout-btn";
import { profileMenuItems } from "@/data/profileMenuItems";
import Dropdown from "@/components/ui/dropdown";
import { useUser } from "@/hooks/useAuth";

export default function ProfileDropdown() {
  const { data: user = {} } = useUser();

  const getInitial = (name: string = "") => name.charAt(0).toUpperCase();

  const Avatar = ({ size = 40 }: { size?: number }) => {
    if (user?.profilePicture) {
      return (
        <div
          style={{ width: size, height: size }}
          className="relative rounded-full overflow-hidden"
        >
          <Image
            src={process.env.NEXT_PUBLIC_API_BASE_URL + user.profilePicture}
            alt={user?.name || "User Avatar"}
            fill
            className="object-cover"
          />
        </div>
      );
    }
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center rounded-full bg-header text-white font-semibold"
      >
        {getInitial(user?.name)}
      </div>
    );
  };


  const button = (
    <button className="flex items-center bg-white rounded-full pl-3 pr-2 py-1 space-x-2 w-fit hover:shadow-md transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-aqua focus:ring-offset-1">
      <BellIcon className="h-5 w-5 text-green-500" />
      <Avatar size={28} />
    </button>
  );

  const content = (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 md:w-64">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar size={40} />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="py-1">
        {profileMenuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          >
            {item.label}
          </Link>
        ))}
        <LogoutButton />
      </div>
    </div>
  );

  return <Dropdown button={button}>{content}</Dropdown>;
}
