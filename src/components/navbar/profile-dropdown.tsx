"use client";
import Image from "next/image";
import { BellIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import LogoutButton from "../auth/logout-btn";
import { profileMenuItems } from "@/data/profileMenuItems";
import Dropdown from "@/components/ui/dropdown";
import { useUser } from "@/hooks/useAuth";
import { Skeleton } from "../ui/skeleton";
import { capitalizeWords } from "@/utils/capitalizeWords";
import { timeAgo } from "@/utils/timeAgo";
import { useNotification } from "@/hooks/useNotification";
import { Notification } from "@/types/notification";

const NotificationContent = () => {
  const { data: notifications, isLoading } = useNotification();
  // const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 md:w-80">
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <p className="text-base font-semibold text-gray-900">Notifications</p>
        <Link href="/notifications" className="text-xs text-aqua hover:text-green-600 font-medium">
          View All
        </Link>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : notifications && notifications.length > 0 ? (
          notifications.map((item: Notification) => (
            <Link
              key={item._id}
              href={`/dashboard/${item.data.type}/${item.data.listingId}`}
              className={`block px-4 py-3 transition-colors duration-150 ${item.isRead ? "text-gray-700 hover:bg-gray-50" : "bg-green-50/50 text-gray-900 hover:bg-green-100"
                }`}
            >
              <p className="text-sm font-medium leading-snug">{item.title}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.message}</p>
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <ClockIcon className="h-3 w-3 mr-1" />
                {timeAgo(item?.createdAt?.toString() || "")}
              </div>
            </Link>
          ))
        ) : (
          <p className="px-4 py-3 text-sm text-gray-500">No new notifications.</p>
        )}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function ProfileDropdown() {
  const { data: user = {}, isLoading } = useUser();
  // const { unreadCount } = useNotifications(); // Use the hook to get unread count for the badge

  const getInitial = (name = "") => name.charAt(0).toUpperCase();

  const ProfileImage = ({ size = 40 }) => {
    if (isLoading) {
      return <Skeleton className="rounded-full" style={{ width: size, height: size }} />;
    }

    if (user?.profilePicture) {
      return (
        <div style={{ width: size, height: size }} className="relative rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={process.env.NEXT_PUBLIC_API_BASE_URL + user.profilePicture}
            alt={user?.name || "User Avatar"}
            width={256}
            height={256}
            className={`object-cover rounded-full w-full h-full`}
          />
        </div>
      );
    }

    // 🔹 If no image available, show initial
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center rounded-full bg-aqua text-white text-sm font-semibold flex-shrink-0"
      >
        {getInitial(user?.name)}
      </div>
    );
  };

  const notificationButton = (
    <button
      className="relative p-1 rounded-full text-green-500 hover:bg-gray-200 transition-colors"
      aria-label="Notifications"
    >
      <BellIcon className="h-5 w-5" />
      {/* Notification Badge */}
      {/* {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )} */}
    </button>
  );

  const profileButton = (
    <button
      className="p-0.5 rounded-full bg-white hover:bg-gray-200 transition-shadow duration-200"
      aria-label="User Profile Menu"
    >
      <ProfileImage size={28} />
    </button>
  );

  const profileContent = (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 md:w-64">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <ProfileImage size={40} />
            {/* Online dot */}
            {!isLoading && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <>
                <Skeleton className="h-3 w-20 mb-1 rounded" />
                <Skeleton className="h-2 w-32 rounded" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {capitalizeWords(user?.name)}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </>
            )}
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

  return (
    // This wrapper mimics the visual grouping of the original single button.
    <div className="flex items-center space-x-1.5 bg-white rounded-full pl-2 pr-1 py-0.5 w-fit hover:shadow-md transition-shadow duration-200">
      {/* Dropdown 1: Notifications (Bell) */}
      <Dropdown button={notificationButton}>
        <NotificationContent />
      </Dropdown>

      {/* Dropdown 2: Profile (Image) */}
      <Dropdown button={profileButton}>
        {profileContent}
      </Dropdown>
    </div>
  );
}