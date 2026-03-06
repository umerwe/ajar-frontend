import axios from "axios"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ account }) {
      if (account?.provider === "google" && account?.id_token) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/oauth/google/nextauth`,
            { idToken: account.id_token }
          )
          account.backendToken = response.data.data.token  // store on account
        } catch {
          return false
        }
      }
      return true
    },

    async jwt({ token, account }) {
      if (account?.backendToken) {
        token.backendToken = account.backendToken  // persist in JWT
      }
      return token
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken as string  // expose to client
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
})