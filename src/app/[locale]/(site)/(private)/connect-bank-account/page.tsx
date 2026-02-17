"use client";

import { useUser } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

const BankAccountStatusPage = () => {
  const { data: userData } = useUser();

  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const [bankAttached, setBankAttached] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccount = async () => {
      try {
        const res = await api.get("/api/payments/connected-account");
        setBankAttached(res.data.bankAttached);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setBankAttached(false);
        } else {
          setError("Failed to check bank account status");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAccount();
  }, []);

  // 🔹 2️⃣ Create account if not connected
  const handleConnectBank = async () => {
    try {
      setConnecting(true);
      setError("");

      const response = await api.post(
        "/api/payments/create-connected-account",
        {
          userId: userData?._id,
          email: userData?.email,
          country: "US",
        }
      );

      window.location.href = response.data.url;
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-6 text-center">
        Bank Account Status
      </h1>

      {loading && <p className="text-center">Checking bank status...</p>}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && bankAttached === true && (
        <div className="text-center">
          <p className="text-green-600 font-semibold mb-2">
            ✅ Bank Account Connected
          </p>
          <p className="text-gray-500 text-sm">
            Your bank account is verified and ready to receive payouts.
          </p>
        </div>
      )}

      {!loading && bankAttached === false && (
        <div className="text-center">
          <p className="text-yellow-600 font-medium mb-4">
            ⚠️ No bank account connected
          </p>

          <button
            onClick={handleConnectBank}
            disabled={connecting}
            className="px-4 py-2 bg-header text-white rounded hover:bg-header transition disabled:opacity-50"
          >
            {connecting ? "Redirecting..." : "Connect Bank Account"}
          </button>

          <p className="mt-4 text-gray-500 text-sm">
            You will be redirected to Stripe to complete KYC and bank setup.
          </p>
        </div>
      )}
    </div>
  );
};

export default BankAccountStatusPage;
