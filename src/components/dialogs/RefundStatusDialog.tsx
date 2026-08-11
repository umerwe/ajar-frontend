"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Info, Clock } from "lucide-react"

interface RefundBreakdownLine {
  booking: string;
  isExtension: boolean;
  price: number;
  deductedAmount: number;
  refundAmount: number;
  refundedAt?: string;
}

interface RefundStatusDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  refundRequest: {
    status: "pending" | "accept" | "reject";
    totalRefundAmount?: number;
    isEarlyReturn?: boolean;
    breakdown?: RefundBreakdownLine[];
  };
  refundNote?: string;
  booking?: any;
}

// The deposit follows its own path on an early return — it is held first, then
// released, deducted, or partially returned once the dispute window resolves.
const DEPOSIT_STATE: Record<string, { label: string; className: string }> = {
  held: { label: "On hold", className: "text-amber-600" },
  disputed: { label: "Under dispute", className: "text-amber-600" },
  released: { label: "Returned", className: "text-emerald-600" },
  partially_refunded: { label: "Partially returned", className: "text-emerald-600" },
  deducted: { label: "Deducted for damage", className: "text-red-500" },
};

const RefundStatusDialog = ({
  isOpen,
  onOpenChange,
  refundRequest,
  refundNote,
  booking,
}: RefundStatusDialogProps) => {
  if (!refundRequest) return null;

  const refundAmount = refundRequest.totalRefundAmount ?? 0;
  const securityDeposit = booking?.priceDetails?.securityDeposit ?? 0;
  const adminFee = booking?.priceDetails?.adminFee ?? 0;
  const tax = booking?.priceDetails?.tax ?? 0;

  const isEarlyReturn = Boolean(refundRequest.isEarlyReturn);
  const lines = refundRequest.breakdown ?? [];
  const hasExtensions = lines.length > 1;

  const depositStatus = booking?.depositStatus as string | undefined;
  const depositState = depositStatus ? DEPOSIT_STATE[depositStatus] : undefined;
  const isDepositPending = depositStatus === "held" || depositStatus === "disputed";

  // On an early return the platform keeps its fee and the deposit is settled
  // separately once the damage dispute window closes.
  const totalRefundAmount = isEarlyReturn
    ? refundAmount
    : refundAmount + securityDeposit + adminFee + tax;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEarlyReturn ? "Early Return Request" : "Refund Request"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-5">
          {/* Status Row */}
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-500 font-medium">Status</span>
            <span
              className={`font-semibold uppercase tracking-wider ${
                refundRequest.status === "accept"
                  ? "text-emerald-600"
                  : refundRequest.status === "reject"
                  ? "text-red-500"
                  : "text-aqua"
              }`}
            >
              {refundRequest.status}
            </span>
          </div>

          {/* Amount Row */}
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-500 font-medium">Refund Amount</span>
            <span className="text-lg font-semibold text-gray-900">
              ${totalRefundAmount?.toFixed(2)}
            </span>
          </div>

          {/* Each extension is refunded separately to its own payment method */}
          {hasExtensions && (
            <div className="space-y-1.5 border-b pb-3">
              {lines.map((line) => (
                <div key={line.booking} className="flex justify-between text-xs">
                  <span className="text-gray-400">
                    {line.isExtension ? "Extension" : "Booking"}
                  </span>
                  <span className="text-gray-500">
                    ${line.refundAmount?.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Security Deposit — reflects where the deposit actually stands */}
          {securityDeposit > 0 && (
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500 font-medium">Security Deposit</span>
              {isEarlyReturn ? (
                depositState ? (
                  <span
                    className={`font-semibold flex items-center gap-1.5 ${depositState.className}`}
                  >
                    {isDepositPending && <Clock className="w-4 h-4" />}
                    {depositState.label}
                  </span>
                ) : (
                  <span className="font-semibold text-gray-500">—</span>
                )
              ) : (
                <span className="font-semibold text-emerald-600">Included</span>
              )}
            </div>
          )}

          {/* Pending Message */}
          {refundRequest.status === "pending" && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
              <Info className="w-5 h-5 text-aqua shrink-0" />
              <p className="text-xs text-blue-800 leading-relaxed">
                Your request is currently under review by our administration team.
                Funds will be credited to your wallet once approved.
              </p>
            </div>
          )}

          {/* Early return — only while the deposit is still unsettled */}
          {isEarlyReturn &&
            isDepositPending &&
            securityDeposit > 0 &&
            refundRequest.status !== "reject" && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Your security deposit of ${securityDeposit.toFixed(2)} is held until
                  the damage dispute window closes, then returned automatically.
                  Service fees are not refunded once a rental has started.
                </p>
              </div>
            )}

          {/* Deposit went to a damage claim */}
          {isEarlyReturn && depositStatus === "deducted" && securityDeposit > 0 && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex gap-3">
              <Info className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-xs text-red-700 leading-relaxed">
                Your security deposit was used to settle an approved damage report.
                See the damage report on your booking for the full breakdown.
              </p>
            </div>
          )}

          {/* Rejected Message & Note */}
          {refundRequest.status === "reject" && refundNote && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex gap-3">
              <Info className="w-5 h-5 text-red-500 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-red-600 uppercase">
                  Reason for Rejection
                </p>
                <p className="text-sm text-gray-700 italic">&quot;{refundNote}&quot;</p>
              </div>
            </div>
          )}
        </div>

        <Button
          variant="destructive"
          className="w-full"
          onClick={() => onOpenChange(false)}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default RefundStatusDialog;
