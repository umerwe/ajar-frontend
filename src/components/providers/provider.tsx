"use client"
import type React from "react"
import { ThemeProvider } from "./theme-provider"
import { NextIntlClientProvider } from "next-intl"
import ReactQueryProvider from "./query-provider"
import AuthGuard from "../auth/auth-guard"
import { Toaster } from "@/components/ui/toast"

export default function Providers({ children, messages, locale, dehydratedState }: ProviderProps) {
  return (
    <ReactQueryProvider dehydratedState={dehydratedState}>
      <ThemeProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthGuard>
            {children}
            <Toaster />
          </AuthGuard>
        </NextIntlClientProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  )
}
