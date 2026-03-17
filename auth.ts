import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Naver from "next-auth/providers/naver";
import Kakao from "next-auth/providers/kakao";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { getFirstChurchByUserId } from "@/lib/church-context";
import { hashPassword, isHashedPassword, verifyPassword } from "@/lib/password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12,
  },
  providers: [
    Credentials({
      name: "이메일 로그인",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) return null;

        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) return null;

        if (!isHashedPassword(user.passwordHash)) {
          await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: await hashPassword(password) },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
    Naver({
      clientId: process.env.AUTH_NAVER_ID ?? "",
      clientSecret: process.env.AUTH_NAVER_SECRET ?? "",
    }),
    Kakao({
      clientId: process.env.AUTH_KAKAO_ID ?? "",
      clientSecret: process.env.AUTH_KAKAO_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") return true;

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
  const PLATFORM_ADMIN_EMAILS = ["platform-admin@soom.church", "admin@soom.church"];
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return "/app";
  if (PLATFORM_ADMIN_EMAILS.includes(user.email)) return "/platform-admin";
  const church = await getFirstChurchByUserId(user.id);
  if (church) return `/app/${church.slug}/dashboard`;
  return "/app";
}
