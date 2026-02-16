"use client"

import { useParams } from "next/navigation";
import { ShieldAlert, Info } from "lucide-react";
import Link from "next/link";

const AccountStatusPage = () => {
  const params = useParams();
  const reason = params?.reason as string;

  const isBlocked = reason === "blocked";

  return (
    <div className="min-h-[calc(100vh-40px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          {isBlocked ? (
            <div className="p-4 bg-red-100 rounded-full">
              <ShieldAlert className="w-12 h-12 text-red-600" />
            </div>
          ) : (
            <div className="p-4 bg-amber-100 rounded-full">
              <Info className="w-12 h-12 text-amber-600" />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isBlocked ? "Account Blocked" : "Account Inactive"}
        </h1>

        <p className="text-gray-600 mb-8">
          {isBlocked
            ? "Your account has been restricted due to a violation of our terms of service or suspicious activity."
            : "Your account is currently inactive. This might be because it is pending verification or has been temporarily disabled."
          }
        </p>

        <div className="space-y-4">
          <Link 
            href="/auth/login" 
            className="block w-full bg-header text-white py-3 rounded-xl font-medium hover:bg-teal-700 transition shadow-sm"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountStatusPage;