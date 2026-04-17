"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, XCircle, Paperclip, Loader2 } from "lucide-react"
import MyImage from "../MyImage";
import { useStatusDamageReport } from "@/hooks/useReport";
import { toast } from "../ui/toast";
import { useState } from "react";

interface DamagedReportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  status: string;
  report: {
    issueType: string;
    rentalText: string;
    damagedCharges: number;
    status: string;
    attachments?: string[];
  };
}

const DamagedReportDialog = ({
  isOpen,
  onOpenChange,
  bookingId,
  status,
  report,
}: DamagedReportDialogProps) => {
  const [actionLoading, setActionLoading] = useState<"approve" | "reject" | null>(null);

  const { mutate: processReport, isPending } = useStatusDamageReport();

  if (!report) return null;

  const handleAction = (action: "approve" | "reject") => {
    setActionLoading(action);

    processReport(
      { bookingId, action },
      {
        onSuccess: () => {
          setActionLoading(null);
          onOpenChange(false);
          toast({
            title: `Damage Report ${action === "approve" ? "Approved" : "Rejected"} Successfully`,
          });
        },
        onError: () => {
          setActionLoading(null);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Damage Report Details</DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-5">
          {/* Status & Issue Type */}
          <div className="flex justify-between items-start border-b pb-3">
            <div>
              <p className="text-sm text-gray-500">Issue Type</p>
              <p className="font-semibold text-gray-900">{report.issueType}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${report.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                }`}
            >
              {report.status}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Leaser's Remarks</p>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed">
                {report.rentalText}
              </p>
            </div>
          </div>

          {/* Attachments Section */}
          {report.attachments && report.attachments.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-gray-400" />
                <p className="text-sm text-gray-500">Evidence Attachments</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {report.attachments.map((src, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100">
                    <MyImage
                      src={src}
                      width={100}
                      height={100}
                      alt={`Damage evidence ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Charges Row */}
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-500 text-sm">Charges</span>
            <span className="text-lg font-semibold text-red-600">
              ${report.damagedCharges?.toFixed(2)}
            </span>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-aqua/20 rounded-xl border border-aqua/30 flex gap-3">
            <AlertCircle className="w-5 h-5 text-aqua shrink-0" />
            <p className="text-xs text-black leading-relaxed">
              These charges will be deducted directly from your <strong>Wallet balance</strong>.
              Please review the evidence before approving or rejecting this claim.
            </p>
          </div>
        </div>

        {/* Action Buttons - Only visible if status is pending */}
        {status === "pending" && (
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              disabled={isPending}
              onClick={() => handleAction("reject")}
            >
              {actionLoading === "reject" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </>
              )}
            </Button>

            <Button
              className="flex-1"
              variant="destructive"
              disabled={isPending}
              onClick={() => handleAction("approve")}
            >
              {actionLoading === "approve" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DamagedReportDialog;