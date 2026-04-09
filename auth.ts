import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Naver from "next-auth/providers/naver";
import Kakao from "next-auth/providers/kakao";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { getFirstChurchByUserId } from "@/lib/church-context";
import { hashPassword, isHashedPassword, verifyPassword } from "@/lib/password";
import { isPlatformAdminEmail, PLATFORM_ADMIN_EMAILS } from "@/lib/admin";

const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "soom-temporary-prod-secret-change-me";

const gidoSimpleLoginId = (process.env.GIDO_SIMPLE_LOGIN_ID || "gido").trim().toLowerCase();
const gidoLeaderEmail = (process.env.GIDO_LEADER_EMAIL || process.env.GIDO_LEADER1_EMAIL || "gido.mokja1@soom.church").trim().toLowerCase();

function resolveCredentialEmails(rawIdentifier: string) {
  const identifier = rawIdentifier.trim().toLowerCase();
  if (!identifier) return [];

  const candidates = new Set<string>();

  if (identifier.includes("@")) {
    candidates.add(identifier);
  } else {
    candidates.add(`${identifier}@soom.church`);
    if (identifier === gidoSimpleLoginId || identifier === "mokja" || identifier === "목자") {
      candidates.add(gidoLeaderEmail);
    }
  }

  return [...candidates];
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: authSecret,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12,
  },
  providers: [
    Credentials({
      name: "아이디 로그인",
      credentials: {
        identifier: { label: "아이디", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        const identifier = String(credentials?.identifier ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        const candidateEmails = resolveCredentialEmails(identifier);
        if (candidateEmails.length === 0 || !password) return null;

        const user = await prisma.user.findFirst({
          where: { email: { in: candidateEmails } },
          orderBy: { email: "asc" },
        });
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
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return "/app";
  if (isPlatformAdminEmail(user.email)) return "/platform-admin";

  const church = await getFirstChurchByUserId(user.id);
  if (church) return church.slug === "gido" ? `/app/${church.slug}/chat` : `/app/${church.slug}/dashboard`;

  if (user.email === "dev@soom.church") {
    return "/app/soom-dev/dashboard";
  }

  return "/app";
}
