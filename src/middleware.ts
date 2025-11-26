import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Initialize the next-intl middleware
const intlMiddleware = createIntlMiddleware(routing)

// Middleware-compatible auth function
async function authMiddleware(request: NextRequest) {
  // Example: read token from cookies
  const token = request.cookies.get('token')?.value

  // Redirect to login if token missing
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Return session or true if valid
  return { user: { token } }
}

export default async function middleware(request: NextRequest) {
  // 1️⃣ Apply authentication
  const authResult = await authMiddleware(request)
  if (authResult instanceof NextResponse) {
    return authResult
  }

  // 2️⃣ Apply locale-based routing
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)', // applies to all non-API routes
  ],
}
