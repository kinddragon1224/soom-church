import { MemberForm } from "@/components/members/member-form";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";


export default async function EditMemberPage({ params }: { params: { id: string } }) {
  const member = await prisma.member.findUnique({ where: { id: params.id } });
  if (!member) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">교인 수정</h1>
      <MemberForm member={member} />
    </div>
  );
}
