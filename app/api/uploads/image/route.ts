import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import path from "node:path";

const MAX_SIZE = 5 * 1024 * 1024;

function cleanPathSegment(value: FormDataEntryValue | null, fallback: string) {
  if (typeof value !== "string") return fallback;
  const next = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .slice(0, 80);
  return next.length > 0 ? next : fallback;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const churchSlug = cleanPathSegment(formData.get("churchSlug"), "default");
  const accountKey = cleanPathSegment(formData.get("accountKey"), "anon");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "image only" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "max 5MB" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "png";
  const filename = `${Date.now()}-${randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "members", churchSlug, accountKey);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), bytes);

  return NextResponse.json({ url: `/uploads/members/${churchSlug}/${accountKey}/${filename}` });
}
