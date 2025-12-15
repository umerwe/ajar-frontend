import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

async function authMiddleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url)) 
  }

  return true;
}

export default async function middleware(request: NextRequest) {
  const localeResponse = intlMiddleware(request)
  if (localeResponse) return localeResponse

  const authResult = await authMiddleware(request)
  if (authResult instanceof NextResponse) return authResult

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
  ],
}
