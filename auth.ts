import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";
import { getFirstChurchByUserId } from "@/lib/church-context";
import { isPlatformAdminEmail } from "@/lib/admin";

const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "soom-temporary-prod-secret-change-me";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: authSecret,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12,
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") return false;

      const email = user.email?.trim().toLowerCase();
      if (!email) return false;

      const displayName = user.name?.trim() || (typeof profile?.name === "string" ? profile.name : null) || email.split("@")[0];
      const existing = await prisma.user.findUnique({ where: { email } });

      if (!existing) {
        await prisma.user.create({
          data: {
            email,
            name: displayName,
            passwordHash: "",
            isActive: true,
          },
        });
      } else if (!existing.isActive) {
        return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      const email = (user?.email ?? token.email)?.toString().trim().toLowerCase();
      if (!email) return token;

      const dbUser = await prisma.user.findUnique({ where: { email } });
      if (dbUser) {
        token.userId = dbUser.id;
        token.name = dbUser.name;
        token.email = dbUser.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = String(token.userId);
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const target = new URL(url);
        if (target.origin === baseUrl) return url;
      } catch {}
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export async function getPostLoginPath(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return "/app";
  if (isPlatformAdminEmail(user.email)) return "/platform-admin";

  const church = await getFirstChurchByUserId(user.id);
  if (church) return `/app/${church.slug}/world`;

  return "/app/onboarding";
}
