"use client"

import type React from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface StateHandlerProps {
  isHome?: boolean | undefined
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  isEmpty?: boolean

  // Customization props
  emptyTitle?: string
  emptyMessage?: string
  emptyIcon?: React.ReactNode
  emptyActionText?: string
  emptyActionHref?: string
  className?: string
}

const StateHandler: React.FC<StateHandlerProps> = ({
  isHome,
  isLoading = false,
  isError = false,
  isEmpty = false,
  emptyTitle,
  emptyMessage,
  emptyIcon,
  emptyActionText,
  emptyActionHref = "/",
  className = 'py-20'
}) => {

  // Loading State
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${isHome ? 'py-36' : className}`}>
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue rounded-full animate-spin mx-auto mb-4"></div>
            <div
              className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-aqua-400 rounded-full animate-spin mx-auto opacity-60"
              style={{ animationDelay: "0.15s" }}
            ></div>
          </div>
        </div>
      </div>
    )
  }


  // Error State
  if (isError) {
    return (
      <div className={`flex items-center justify-center min-h-screen`}>
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load favourites</h3>
          <p className="text-gray-600 mb-6">We couldn&apos;t load the listings. Please check your connection and try again.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Empty State
  if (isEmpty) {
    return (
      <div className={`flex items-center justify-center py-16`}>
        <div className="text-center max-w-md mx-auto">
          <div className="bg-gray-50 rounded-2xl shadow-sm border py-6 px-12">
            <div className="mb-4">{emptyIcon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{emptyTitle}</h3>
            <p className={`text-gray-600 ${emptyActionText ? 'mb-6' : 'mb-0'}`}>{emptyMessage}</p>
            {emptyActionText &&
              <Button asChild variant="destructive">
                <Link href={emptyActionHref}>{emptyActionText}</Link>
              </Button>}
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default StateHandler
