"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { usePathname } from "next/navigation"
import en from "@/messages/en.json"
import ar from "@/messages/ar.json"

export default function NotFound() {
  const pathname = usePathname()
  const messages = pathname?.startsWith("/ar") ? ar.translation : en.translation

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="bg-red-100 p-4 rounded-full mb-6">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-3">404</h1>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {messages.pageNotFound}
      </h2>

      <p className="text-gray-600 text-center max-w-md mb-8">
        {messages.pageNotFoundDescription}
      </p>

      <div className="flex gap-3">
        <Button
          variant="destructive"
          asChild>
          <Link href="/">{messages.goHome}</Link>
        </Button>
      </div>
    </div>
  )
}
