import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import MicrosoftProvider from "next-auth/providers/azure-ad"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google-client-secret",
      allowDangerousEmailAccountLinking: true,
    }),
    MicrosoftProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID || "microsoft-client-id",
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "microsoft-client-secret",
      tenantId: process.env.MICROSOFT_TENANT_ID || "common",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validar credenciales admin
        if (
          credentials?.email === "admin@cvvinvest.com" &&
          credentials?.password === "admin123"
        ) {
          return {
            id: "admin-001",
            email: "admin@cvvinvest.com",
            name: "Administrador",
            role: "admin",
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }
      if (user) {
        token.role = (user as any).role || "user"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string
        (session.user as any).provider = token.provider as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET || "secret-key-change-in-production",
  },
  secret: process.env.NEXTAUTH_SECRET || "secret-key-change-in-production",
}
