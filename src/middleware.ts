import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { auth } from '@/auth'
import { routing } from './i18n/routing'

// Initialize the next-intl middleware
const intlMiddleware = createIntlMiddleware(routing)

export default function middleware(request: NextRequest) {
  // 1️⃣ Apply authentication
  const authResult = auth(request as any)
  if (authResult instanceof NextResponse) {
    return authResult // 🚫 If not authenticated, stop here
  }

  // 2️⃣ Apply locale-based routing
  return intlMiddleware(request) // 🌍 Automatically adds env (locale)
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)', // applies to all non-API routes
  ],
}
