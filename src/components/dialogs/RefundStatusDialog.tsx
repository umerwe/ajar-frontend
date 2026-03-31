"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Info } from "lucide-react"

interface RefundStatusDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  refundRequest: {
    status: "pending" | "accept" | "reject";
    totalRefundAmount?: number;
  };
  refundNote?: string;
}

const RefundStatusDialog = ({
  isOpen,
  onOpenChange,
  refundRequest,
  refundNote,
}: RefundStatusDialogProps) => {
  if (!refundRequest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Refund Request</DialogTitle>
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
              ${refundRequest.totalRefundAmount?.toFixed(2)}
            </span>
          </div>

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

          {/* Rejected Message & Note */}
          {refundRequest.status === "reject" && refundNote && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex gap-3">
              <Info className="w-5 h-5 text-red-500 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-red-600 uppercase">
                  Reason for Rejection
                </p>
                <p className="text-sm text-gray-700 italic">"{refundNote}"</p>
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