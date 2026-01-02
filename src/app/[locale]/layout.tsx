import type React from "react"
import Providers from "@/components/providers/provider"
import { hasLocale } from "next-intl"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"

import { QueryClient, dehydrate } from "@tanstack/react-query"

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = (await import(`@/messages/${locale}.json`)).default

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <>
      <Providers locale={locale} messages={messages} dehydratedState={dehydratedState}>
        <main className="flex-1">{children}</main>
      </Providers>
    </>
  )
}