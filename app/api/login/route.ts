import { signIn } from "@/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  return signIn("credentials", {
    email,
    password,
    redirectTo: next.startsWith("/") ? next : "/app",
  });
}
