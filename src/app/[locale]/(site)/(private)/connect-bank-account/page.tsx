"use client";

import Header from "@/components/ui/header";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useCheckBankConnectionStatus, useCreateConnectedAccount } from "@/hooks/useWallet";
import Loader from "@/components/common/loader";
import { BanknoteIcon, CheckCircle2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function BankAccountStatusPage() {
  const t = useTranslations("translation");
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
        <Header title={t("bankAccountStatus")} />
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
            <div className={`px-6 py-5 flex items-center gap-4 ${bankAttached ? "bg-aqua/10" : "bg-gray-50"}`}>
              <div className={`p-3 rounded-full ${bankAttached ? "bg-header" : "bg-gray-200"}`}>
                {bankAttached ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : (
                  <XCircle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <p className={`font-semibold text-base ${bankAttached ? "text-gray-800" : "text-gray-700"}`}>
                  {bankAttached ? t("bankAccountConnected") : t("noBankAccountLinked")}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {bankAttached
                    ? t("accountVerifiedReadyForPayouts")
                    : t("connectBankToReceiveWithdrawals")}
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
                    {t("stripeKycRedirectDescription")}
                  </p>
                </div>
              )}

              {error && "response" in (error as any) && (error as any).response?.status !== 404 && (
                <p className="text-red-500 text-sm text-center">
                  {t("failedToCheckBankAccountStatus")}
                </p>
              )}

              {bankAttached ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 bg-green-50 border border-green-100 rounded-xl px-4 py-4">
                    <div className="p-2.5 bg-green-100 rounded-full shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-700">{t("payoutsEnabled")}</p>
                      <p className="text-xs text-green-600 mt-0.5">{t("withdrawalsReflectInBank")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-4">
                    <div className="p-2.5 bg-blue-100 rounded-full shrink-0">
                      <BanknoteIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-700">{t("readyToWithdraw")}</p>
                      <p className="text-xs text-blue-600 mt-0.5">{t("goToWalletToWithdraw")}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleConnectBank}
                  className="w-full py-6 text-base rounded-xl"
                  variant="destructive"
                  disabled={isConnecting}
                >
                  {isConnecting ? <Loader /> : t("connectBankAccount")}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
