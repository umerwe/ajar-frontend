"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      {/* Icon */}
      <div className="bg-red-100 p-4 rounded-full mb-6">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-3">404</h1>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-gray-600 text-center max-w-md mb-8">
        Sorry, the page you are looking for doesn&apos;t exist or has been moved.
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}
