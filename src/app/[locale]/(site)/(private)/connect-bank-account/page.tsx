"use client";

import Header from "@/components/ui/header";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useCheckBankConnectionStatus, useCreateConnectedAccount } from "@/hooks/useWallet";
import Loader from "@/components/common/loader";
import { BanknoteIcon, CheckCircle2, XCircle } from "lucide-react";

export default function BankAccountStatusPage() {
  const { data: userData } = useUser();
  const { data: bankStatus, isLoading, error } = useCheckBankConnectionStatus();
  const { mutate: createConnectedAccount, isPending: isConnecting } = useCreateConnectedAccount();

  const [bankAttached, setBankAttached] = useState<boolean | null>(null);

  useEffect(() => {
    if (bankStatus) {
      setBankAttached(bankStatus.bankAttached);
    } else if (error && "response" in (error as any) && (error as any).response?.status === 404) {
      setBankAttached(false);
    }
  }, [bankStatus, error]);

  const handleConnectBank = () => {
    createConnectedAccount(
      {
        userId: userData?._id || "",
        email: userData?.email || "",
        country: "US",
      },
      {
        onSuccess: (response) => {
          if (response?.url) {
            window.location.href = response.url;
          }
        },
        onError: (err: any) => {
          console.error("Failed to connect bank account:", err);
        },
      }
    );
  };

  return (
    <div className="min-h-screen">
      <div className="px-3 sm:px-7">
        <Header title="Bank Account Status" />
      </div>

      {isLoading ? (
        <div className="mx-auto max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mt-6 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm animate-pulse space-y-4">
            <div className="h-24 bg-gray-100 rounded-xl" />
            <div className="h-10 bg-gray-100 rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mt-6 px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Status Banner */}
            <div className={`px-6 py-5 flex items-center gap-4 ${bankAttached ? "bg-green-50" : "bg-gray-50"}`}>
              <div className={`p-3 rounded-full ${bankAttached ? "bg-green-100" : "bg-gray-200"}`}>
                {bankAttached ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <p className={`font-semibold text-base ${bankAttached ? "text-green-700" : "text-gray-700"}`}>
                  {bankAttached ? "Bank Account Connected" : "No Bank Account Linked"}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {bankAttached
                    ? "Your account is verified and ready for payouts."
                    : "Connect your bank to start receiving withdrawals."}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Info + Action */}
            <div className="px-6 py-5 space-y-4">
              {!bankAttached && (
                <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4">
                  <BanknoteIcon className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-blue-700">
                    You'll be redirected to Stripe to securely complete KYC verification and link your bank account.
                  </p>
                </div>
              )}

              {error && "response" in (error as any) && (error as any).response?.status !== 404 && (
                <p className="text-red-500 text-sm text-center">
                  Failed to check bank account status. Please try again later.
                </p>
              )}

              {bankAttached ? (
                <Button className="w-full rounded-xl" variant="outline" disabled>
                  ✅ Account Verified
                </Button>
              ) : (
                <Button
                  onClick={handleConnectBank}
                  className="w-full py-6 text-base rounded-xl"
                  variant="destructive"
                  disabled={isConnecting}
                >
                  {isConnecting ? <Loader /> : "Connect Bank Account"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}