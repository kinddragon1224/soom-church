import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";


export default async function NoticesPage() {
  const notices = await prisma.notice.findMany({ orderBy: { createdAt: "desc" }, include: { author: true } });

  async function createNotice(formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "");
    const content = String(formData.get("content") || "");
    const pinned = formData.get("pinned") === "on";
    const admin = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
    if (!admin || !title || !content) return;
    await prisma.notice.create({ data: { title, content, pinned, authorId: admin.id } });
    await prisma.activityLog.create({ data: { action: "NOTICE_CREATED", targetType: "Notice" } });
    revalidatePath("/notices");
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
      <section className="rounded-xl border border-border bg-white p-3 sm:p-4">
        <h1 className="text-lg font-semibold">공지 작성</h1>
        <form action={createNotice} className="mt-3 space-y-2">
          <input name="title" placeholder="제목" className="w-full rounded border border-border px-3 py-2 text-sm" />
          <textarea name="content" placeholder="내용" className="min-h-28 w-full rounded border border-border px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm"><input name="pinned" type="checkbox" /> 상단 고정</label>
          <button className="rounded bg-primary px-3 py-2 text-sm text-white">저장</button>
        </form>
      </section>
      <section className="rounded-xl border border-border bg-white p-3 sm:p-4">
        <h2 className="text-lg font-semibold">최근 공지</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {notices.map((n) => (
            <li key={n.id} className="rounded border border-border p-2">
              <p className="font-medium">{n.title}{n.pinned ? " 📌" : ""}</p>
              <p className="text-xs text-muted-foreground">작성자: {n.author.name}</p>
              <p className="mt-1 line-clamp-2 text-xs">{n.content}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
