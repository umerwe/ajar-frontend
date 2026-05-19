"use client"

import { useState, useMemo } from "react"
import { Calendar, Clock, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Loader from "../common/loader"

const UNIT_LABELS: Record<string, string> = {
    hour: "Hour",
    day: "Day",
    month: "Month",
    year: "Year",
}

const UNIT_PLURAL: Record<string, string> = {
    hour: "Hours",
    day: "Days",
    month: "Months",
    year: "Years",
}

type PriceMeta = {
    priceFromListing: number
    adminFee: number
    tax: number
    securityDeposit: number
    totalPrice: number
}

export const ExtensionDialog = ({
    open,
    onOpenChange,
    onSubmit,
    minDate,
    isPending,
    priceMeta,
    pricingUnit,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (date: string) => void
    minDate?: string
    isPending?: boolean
    priceMeta?: PriceMeta
    pricingUnit?: string
}) => {
    const unit = pricingUnit ?? "day"
    const [qty, setQty] = useState(1)
    console.log({ priceMeta })

    const newCheckoutDate = useMemo(() => {
        if (!minDate) return null
        const base = new Date(minDate)
        if (isNaN(base.getTime())) return null

        const d = new Date(base)
        if (unit === "hour") d.setUTCHours(d.getUTCHours() + qty)  // ✅ stay in UTC
        else if (unit === "day") d.setDate(d.getDate() + qty)
        else if (unit === "month") d.setMonth(d.getMonth() + qty)
        else if (unit === "year") d.setFullYear(d.getFullYear() + qty)

        return d
    }, [minDate, unit, qty])

    const formatDate = (d: Date | null) => {
        if (!d) return "—"

        if (unit === "hour") {
            // Force local timezone display
            return d.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // user's local tz
            })
        }

        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }

    const handleSubmit = () => {
        if (!newCheckoutDate) return

        if (unit === "hour") {
            onSubmit(newCheckoutDate.toISOString())  // ✅ pure UTC ISO, backend handles it
        } else {
            const yyyy = newCheckoutDate.getFullYear()
            const mm = String(newCheckoutDate.getMonth() + 1).padStart(2, "0")
            const dd = String(newCheckoutDate.getDate()).padStart(2, "0")
            onSubmit(`${yyyy}-${mm}-${dd}`)
        }
    }

    const adjust = (delta: number) => {
        setQty((prev) => Math.max(1, prev + delta))
    }

    const unitLabel = UNIT_LABELS[unit] ?? unit
    const unitPlural = UNIT_PLURAL[unit] ?? unit

    const totalPrice = priceMeta ? priceMeta.priceFromListing * qty : null
    const fmt = (n: number) =>
        n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none rounded-3xl">
                <DialogHeader className="px-6 pt-6 pb-0">
                    <DialogTitle className="text-xl font-bold text-gray-900">Extend Booking</DialogTitle>
                    <DialogDescription className="text-gray-500 text-sm">
                        Choose how long you'd like to extend your rental.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 pt-5 pb-2 space-y-4">

                    {/* Unit Tabs — display only, driven by pricingUnit prop */}
                    <div className="grid grid-cols-4 gap-1.5 bg-gray-100 rounded-2xl p-1">
                        {["hour", "day", "month", "year"].map((u) => (
                            <button
                                key={u}
                                disabled
                                className={`py-2 rounded-xl text-xs font-semibold capitalize ${unit === u
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-400 cursor-default"
                                    }`}
                            >
                                {u.charAt(0).toUpperCase() + u.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Stepper */}
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Duration</p>
                            <p className="text-3xl font-bold text-gray-900 leading-none">
                                {qty}{" "}
                                <span className="text-lg font-medium text-gray-500">
                                    {qty === 1 ? unitLabel : unitPlural}
                                </span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => adjust(-1)}
                                disabled={qty <= 1}
                                className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-700 text-xl font-medium flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all"
                            >
                                −
                            </button>
                            <button
                                onClick={() => adjust(1)}
                                className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-700 text-xl font-medium flex items-center justify-center active:scale-95 transition-all"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* New Checkout Date */}
                    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
                        <div className="bg-white p-2 rounded-xl border border-gray-100">
                            {unit === "hour" ? (
                                <Clock className="w-4 h-4 text-emerald-500" />
                            ) : (
                                <Calendar className="w-4 h-4 text-emerald-500" />
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">New checkout date</p>
                            <p className="text-sm font-semibold text-gray-800 mt-0.5">
                                {formatDate(newCheckoutDate)}
                            </p>
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    {priceMeta && (
                        <div className="rounded-2xl border border-gray-100 p-4 space-y-2.5">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Price / {unitLabel.toLowerCase()}</span>
                                <span className="text-gray-800 font-medium">${fmt(priceMeta.priceFromListing)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>{unitPlural}</span>
                                <span className="text-gray-800">{qty}</span>
                            </div>
                            <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                                <span className="text-sm font-semibold text-gray-900">Extension total</span>
                                <span className="text-sm font-bold text-gray-900">
                                    ${fmt(totalPrice!)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Info Banner */}
                    <div className="flex items-start gap-2.5 bg-blue-50 rounded-2xl p-3.5">
                        <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-blue-600 leading-relaxed">
                            Extension amount will be deducted from your wallet.
                        </p>
                    </div>
                </div>

                <DialogFooter className="px-6 pb-6 pt-3">
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending || !newCheckoutDate}
                        variant="destructive"
                        className="w-full py-6"
                    >
                        {isPending ? <Loader /> : "Confirm Extend Booking"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}