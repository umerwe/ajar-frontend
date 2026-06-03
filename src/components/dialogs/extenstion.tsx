"use client"

import { useState, useMemo } from "react"
import { Calendar, Clock, Info, Sparkles } from "lucide-react"
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

type DynamicPricing = {
    startDate: string
    endDate: string
    price: number
}

const HOUR_MS = 1000 * 60 * 60

const toDateKey = (date: Date) => {
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, "0")
    const day = String(date.getUTCDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

const toLocalDateKey = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

const getDynamicPriceForDate = (
    date: Date,
    dynamicPricing?: DynamicPricing | null,
    useLocalDate = false,
) => {
    if (!dynamicPricing?.startDate || !dynamicPricing?.endDate) return null

    const dynamicPrice = Number(dynamicPricing.price)
    if (!Number.isFinite(dynamicPrice)) return null

    const dateKey = useLocalDate ? toLocalDateKey(date) : toDateKey(date)
    const startDateKey = dynamicPricing.startDate.slice(0, 10)
    const endDateKey = dynamicPricing.endDate.slice(0, 10)

    return dateKey >= startDateKey && dateKey <= endDateKey ? dynamicPrice : null
}

const getPriceForDate = (
    date: Date,
    basePrice: number,
    dynamicPricing?: DynamicPricing | null,
    useLocalDate = false,
) => {
    const dynamicPrice = getDynamicPriceForDate(date, dynamicPricing, useLocalDate)
    return dynamicPrice !== null && Number.isFinite(dynamicPrice) ? dynamicPrice : basePrice
}

export const ExtensionDialog = ({
    open,
    onOpenChange,
    onSubmit,
    minDate,
    isPending,
    priceMeta,
    pricingUnit,
    dynamicPricing
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (date: string) => void
    minDate?: string
    isPending?: boolean
    priceMeta?: PriceMeta
    pricingUnit?: string
    dynamicPricing?: DynamicPricing | null
}) => {
    const unit = pricingUnit ?? "day"
    const [qty, setQty] = useState(1);

    const newCheckoutDate = useMemo(() => {
        if (!minDate) return null
        const base = new Date(minDate)
        if (isNaN(base.getTime())) return null

        const d = new Date(base)
        if (unit === "hour") d.setUTCHours(d.getUTCHours() + qty)
        else if (unit === "day") d.setDate(d.getDate() + qty)
        else if (unit === "month") d.setMonth(d.getMonth() + qty)
        else if (unit === "year") d.setFullYear(d.getFullYear() + qty)

        return d
    }, [minDate, unit, qty])

    const formatDate = (d: Date | null) => {
        if (!d) return "—"

        if (unit === "hour") {
            return d.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            })
        }

        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }

    const formatStringDate = (dateStr?: string) => {
        if (!dateStr) return ""
        const d = new Date(dateStr.slice(0, 10))
        if (isNaN(d.getTime())) return ""
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }

    const handleSubmit = () => {
        if (!newCheckoutDate) return

        if (unit === "hour") {
            onSubmit(newCheckoutDate.toISOString())
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

    // --- ACCURATE PERIOD CALCULATOR LOOP ---
    const extensionUnitPrices = useMemo(() => {
        if (!priceMeta || !minDate) return []

        const current = new Date(minDate)
        if (isNaN(current.getTime())) return []

        const prices: number[] = []

        for (let index = 0; index < qty; index += 1) {
            if (unit === "day") current.setUTCDate(current.getUTCDate() + 1)
            else if (unit === "month") current.setUTCMonth(current.getUTCMonth() + 1)
            else if (unit === "year") current.setUTCFullYear(current.getUTCFullYear() + 1)

            prices.push(getPriceForDate(current, priceMeta.priceFromListing, dynamicPricing, unit === "hour"))

            if (unit === "hour") current.setTime(current.getTime() + HOUR_MS)
        }

        return prices
    }, [dynamicPricing, minDate, priceMeta, qty, unit])

    const displayUnitPrice = extensionUnitPrices.length > 0 && extensionUnitPrices.every(price => price === extensionUnitPrices[0])
        ? extensionUnitPrices[0]
        : priceMeta?.priceFromListing
        
    const totalPrice = priceMeta ? extensionUnitPrices.reduce((sum, price) => sum + price, 0) : null
    
    const fmt = (n: number) =>
        n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Fixed view container boundary rules */}
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none rounded-3xl flex flex-col h-[90dvh] max-h-[640px]">

                {/* ── Pinned Header ── */}
                <DialogHeader className="px-6 pt-6 pb-4 shrink-0 border-b border-gray-100">
                    <DialogTitle className="text-xl font-bold text-gray-900">Extend Booking</DialogTitle>
                    <DialogDescription className="text-gray-500 text-sm">
                        Choose how long you'd like to extend your rental.
                    </DialogDescription>
                </DialogHeader>

                {/* ── Scrollable Body ── */}
                <div className="px-6 pt-5 pb-4 space-y-4 overflow-y-auto flex-1 min-h-0 custom-scrollbar">

                    {/* Unit Tabs */}
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

                    {/* Simple Dynamic Pricing Range Visual Indicator */}
                    {dynamicPricing?.startDate && dynamicPricing?.endDate && (
                        <div className="flex items-center gap-2 bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3.5 text-emerald-800">
                            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                            <p className="text-[11px] font-medium leading-snug">
                                Special Offer: ${fmt(dynamicPricing.price)}/{unit} from {formatStringDate(dynamicPricing.startDate)} to {formatStringDate(dynamicPricing.endDate)}
                            </p>
                        </div>
                    )}

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
                                <span className="text-gray-800 font-semibold">${fmt(displayUnitPrice ?? priceMeta.priceFromListing)}</span>
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

                {/* ── Pinned Footer ── */}
                <DialogFooter className="px-6 pb-6 pt-3 shrink-0 border-t border-gray-100 bg-white">
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