import { prisma } from "@/lib/prisma";
import { permanentlyDeleteMember } from "./server-actions";

export const dynamic = "force-dynamic";

export default async function PlatformAdminMembersPage() {
  const members = await prisma.member.findMany({
    orderBy: [{ isDeleted: "desc" }, { updatedAt: "desc" }],
    include: { church: { select: { name: true, slug: true } } },
    take: 100,
  });

  return (
    <section className="space-y-4 text-[#111111]">
      <div>
        <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">LAB / MEMBERS</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">목원 삭제 관리</h2>
      </div>
      <div className="overflow-x-auto rounded-[24px] border border-[#e6dfd5] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <table className="min-w-full text-sm">
          <thead className="bg-[#FBF9F4] text-[#8C7A5B]">
            <tr>
              <th className="px-4 py-3 text-left font-medium">이름</th>
              <th className="px-4 py-3 text-left font-medium">Lab 공간</th>
              <th className="px-4 py-3 text-left font-medium">상태</th>
              <th className="px-4 py-3 text-left font-medium">완전 삭제</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-t border-[#f1eadf]">
                <td className="px-4 py-3 font-medium">{member.name}</td>
                <td className="px-4 py-3 text-[#5f564b]">{member.church?.name ?? "-"}</td>
                <td className="px-4 py-3 text-[#5f564b]">{member.isDeleted ? "소프트 삭제" : "사용중"}</td>
                <td className="px-4 py-3">
                  <form action={permanentlyDeleteMember.bind(null, member.id)}>
                    <button className="rounded-[12px] border border-[#f0c9c9] bg-[#fff2f2] px-3 py-2 text-xs font-semibold text-[#9a4a4a]">완전 삭제</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
