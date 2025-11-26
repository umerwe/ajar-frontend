import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

async function authMiddleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // You must NOT block intl redirect
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url)) // redirect WITH locale
  }

  return true // simplified
}

export default async function middleware(request: NextRequest) {
  // 1️⃣ First apply intl
  const localeResponse = intlMiddleware(request)
  if (localeResponse) return localeResponse

  // 2️⃣ Then auth (must not block internationalization)
  const authResult = await authMiddleware(request)
  if (authResult instanceof NextResponse) return authResult

  // 3️⃣ Default return if everything ok
  return NextResponse.next()
}

export const config = {
  matcher: [
    // 🧠 Add locale support properly
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
  ],
}
