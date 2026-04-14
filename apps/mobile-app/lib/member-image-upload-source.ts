import { getCurrentAccountKey, getCurrentChurchSlug } from "./auth-bridge";

const WEB_BASE_URL = process.env.EXPO_PUBLIC_WEB_BASE_URL ?? "https://soom.io.kr";

export async function uploadMemberImageFromUri(uri: string) {
  const fileName = uri.split("/").pop() ?? `member-${Date.now()}.jpg`;
  const ext = fileName.split(".").pop()?.toLowerCase();
  const mimeType = ext === "png" ? "image/png" : "image/jpeg";

  const formData = new FormData();
  const churchSlug = (await getCurrentChurchSlug()) ?? "gido";
  const accountKey = (await getCurrentAccountKey()) ?? "anon";

  formData.append("churchSlug", churchSlug);
  formData.append("accountKey", accountKey);
  formData.append("file", {
    uri,
    name: fileName,
    type: mimeType,
  } as unknown as Blob);

  const response = await fetch(`${WEB_BASE_URL}/api/uploads/image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`upload failed: ${response.status}`);
  }

  const payload = (await response.json()) as { url?: string };
  if (!payload.url) {
    throw new Error("upload failed: empty url");
  }

  if (payload.url.startsWith("http")) return payload.url;
  return `${WEB_BASE_URL}${payload.url}`;
}
