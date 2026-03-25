export const PLATFORM_ADMIN_EMAILS = ["platform-admin@soom.church", "admin@soom.church"];

export function isPlatformAdminEmail(email?: string | null) {
  if (!email) return false;
  return PLATFORM_ADMIN_EMAILS.includes(email.trim().toLowerCase());
}
