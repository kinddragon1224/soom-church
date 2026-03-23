import { prisma } from "@/lib/prisma";
import { signIn, getPostLoginPath } from "@/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  const redirectTo = next.startsWith("/") ? next : user ? await getPostLoginPath(user.id) : "/app";

  return signIn("credentials", {
    email,
    password,
    redirectTo,
  });
}
