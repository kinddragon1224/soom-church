import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/ui/badge";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; followup?: string };
}) {
  const q = searchParams.q ?? "";
  const status = searchParams.status ?? "";
  const followup = searchParams.followup === "1";

  const members = await prisma.member.findMany({
    where: {
      isDeleted: false,
      name: { contains: q, mode: "insensitive" },
      ...(status ? { statusTag: status } : {}),
      ...(followup ? { requiresFollowUp: true } : {}),
    },
    include: { district: true, group: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold sm:text-xl">교인 목록 {followup ? "(후속관리 필요)" : ""}</h1>
        <Link href="/members/new" className="inline-block rounded-md bg-primary px-3 py-2 text-center text-sm text-white">교인 등록</Link>
      </div>
      <form className="grid gap-2 rounded-lg border border-border bg-white p-3 sm:flex sm:items-center">
        <input name="q" defaultValue={q} placeholder="이름 검색" className="w-full rounded-md border border-border px-3 py-2 text-sm sm:w-52" />
        <input name="status" defaultValue={status} placeholder="상태 태그" className="w-full rounded-md border border-border px-3 py-2 text-sm sm:w-52" />
        <label className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs sm:text-sm">
          <input name="followup" type="checkbox" value="1" defaultChecked={followup} /> 후속관리만
        </label>
        <button className="rounded-md border border-border px-3 py-2 text-sm">필터</button>
      </form>
      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="min-w-[720px]">
          <thead><tr><th>이름</th><th>연락처</th><th>교구/목장</th><th>상태</th><th>후속관리</th></tr></thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td><Link className="text-primary underline-offset-2 hover:underline" href={`/members/${m.id}`}>{m.name}</Link></td>
                <td>{m.phone}</td>
                <td>{m.district?.name ?? "-"} / {m.group?.name ?? "-"}</td>
                <td><StatusBadge>{m.statusTag}</StatusBadge></td>
                <td>{m.requiresFollowUp ? "필요" : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
