import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Edge-safe config — no bcrypt, no mongoose, no Node.js-only modules.
// Used by middleware. auth.ts extends this with Credentials + DB callbacks.
export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "customer";
        token.name = user.name;
        token.email = user.email;
      }
      if (account?.provider === "google" && profile) {
        token.name = (profile as { name?: string }).name ?? token.name;
        token.email = (profile as { email?: string }).email ?? token.email;
        token.picture = (profile as { picture?: string }).picture;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = (token.picture as string) ?? null;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
};
