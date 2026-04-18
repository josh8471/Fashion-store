import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        const user = await User.findOne({
          email: (credentials.email as string).toLowerCase(),
        }).select("+password");

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();
          if (!user.email) return false;
          const existing = await User.findOne({ email: user.email });
          if (!existing) {
            await User.create({
              name: user.name ?? "Google User",
              email: user.email,
              role: "customer",
            });
          }
        } catch {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      // Credentials sign-in: user object has role from authorize()
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "customer";
        token.name = user.name;
        token.email = user.email;
      }
      // Google sign-in: fetch role from DB (Google profile has no role)
      if (account?.provider === "google") {
        if (profile) {
          token.name = (profile as { name?: string }).name ?? token.name;
          token.email = (profile as { email?: string }).email ?? token.email;
          token.picture = (profile as { picture?: string }).picture;
        }
        if (token.email) {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email }).lean() as { _id: { toString(): string }; role?: string } | null;
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role ?? "customer";
          }
        }
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
});
