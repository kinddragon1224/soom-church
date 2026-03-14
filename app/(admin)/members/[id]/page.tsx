import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/date";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";


export default async function MemberDetailPage({ params }: { params: { id: string } }) {
  const member = await prisma.member.findUnique({
    where: { id: params.id },
    include: { district: true, group: true, household: true },
  });

  if (!member) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">교인 상세</h1>
        <Link href={`/members/${member.id}/edit`} className="rounded-md border border-border px-3 py-2 text-sm">수정</Link>
      </div>
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-white p-4 md:grid-cols-2">
        <Field label="이름" value={member.name} />
        <Field label="상태" value={<StatusBadge>{member.statusTag}</StatusBadge>} />
        <Field label="성별" value={member.gender} />
        <Field label="생년월일" value={formatDate(member.birthDate)} />
        <Field label="연락처" value={member.phone} />
        <Field label="이메일" value={member.email ?? "-"} />
        <Field label="주소" value={member.address ?? "-"} />
        <Field label="가족" value={member.household?.name ?? "-"} />
        <Field label="교구" value={member.district?.name ?? "-"} />
        <Field label="목장" value={member.group?.name ?? "-"} />
        <Field label="등록일" value={formatDate(member.registeredAt)} />
        <Field label="직분" value={member.position ?? "-"} />
        <Field label="후속관리" value={member.requiresFollowUp ? "필요" : "-"} />
        <Field label="Soft Delete" value={member.isDeleted ? "Y" : "N"} />
        <Field label="메모" value={member.notes ?? "-"} className="md:col-span-2" />
      </div>
    </div>
  );
}

function Field({ label, value, className }: { label: string; value: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
