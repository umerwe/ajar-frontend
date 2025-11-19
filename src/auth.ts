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
          console.log(account.id_token)
          // Send the Google idToken to your backend
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/oauth/google`, {
            params: {
              idToken: account.id_token,
              platform: "web",
            },
          })
          console.log(response.data)
          console.log(account.id_token)
          console.log("✅ Sent Google token to backend successfully")
        } catch (error) {
          console.error("❌ Error sending token to backend:", error)
          return false // cancel login if backend rejects
        }
      }
      return true
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
})
