"use client"
import { ThemeProvider } from "./theme-provider"
import { NextIntlClientProvider } from "next-intl"
import ReactQueryProvider from "./query-provider"
import AuthGuard from "../auth/auth-guard"
import { Toaster } from "@/components/ui/toast"
import { SocketProvider } from "@/context/SocketContext"

export default function Providers({ children, messages, locale }: ProviderProps) {
  return (
    <ReactQueryProvider>
      <ThemeProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthGuard>
            <SocketProvider>
              {children}
              <Toaster />
            </SocketProvider>
          </AuthGuard>
        </NextIntlClientProvider>
      </ThemeProvider>
    </ReactQueryProvider>

  )
}
