import { prisma } from "@/lib/prisma";
import { STATUS_TAGS } from "@/lib/constants";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Gender, type Member } from "@prisma/client";

export async function MemberForm({ member }: { member?: Member }) {
  const [districts, groups, households] = await Promise.all([
    prisma.district.findMany({ orderBy: { name: "asc" } }),
    prisma.group.findMany({ orderBy: { name: "asc" } }),
    prisma.household.findMany({ orderBy: { name: "asc" } }),
  ]);

  async function saveMember(formData: FormData) {
    "use server";

    const data = {
      name: String(formData.get("name") || ""),
      gender: String(formData.get("gender") || "OTHER") as Gender,
      birthDate: new Date(String(formData.get("birthDate") || new Date().toISOString())),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || "") || null,
      address: String(formData.get("address") || "") || null,
      householdId: String(formData.get("householdId") || "") || null,
      districtId: String(formData.get("districtId") || "") || null,
      groupId: String(formData.get("groupId") || "") || null,
      registeredAt: new Date(String(formData.get("registeredAt") || new Date().toISOString())),
      position: String(formData.get("position") || "") || null,
      statusTag: String(formData.get("statusTag") || "등록대기"),
      requiresFollowUp: formData.get("requiresFollowUp") === "on",
      notes: String(formData.get("notes") || "") || null,
      isDeleted: formData.get("isDeleted") === "on",
    };

    if (member) {
      await prisma.member.update({ where: { id: member.id }, data });
      await prisma.activityLog.create({ data: { action: "MEMBER_UPDATED", targetType: "Member", targetId: member.id } });
      redirect(`/members/${member.id}`);
    }

    const created = await prisma.member.create({ data });
    await prisma.activityLog.create({ data: { action: "MEMBER_CREATED", targetType: "Member", targetId: created.id, memberId: created.id } });
    redirect(`/members/${created.id}`);
  }

  return (
    <form action={saveMember} className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-white p-4 lg:grid-cols-2">
      <label className="text-sm">이름<input name="name" defaultValue={member?.name} required className="mt-1 w-full rounded-md border border-border px-3 py-2" /></label>
      <label className="text-sm">성별<select name="gender" defaultValue={member?.gender ?? "OTHER"} className="mt-1 w-full rounded-md border border-border px-3 py-2"><option value="MALE">남성</option><option value="FEMALE">여성</option><option value="OTHER">기타</option></select></label>
      <label className="text-sm">생년월일<input name="birthDate" type="date" defaultValue={member?.birthDate?.toISOString().slice(0,10)} required className="mt-1 w-full rounded-md border border-border px-3 py-2" /></label>
      <label className="text-sm">연락처<input name="phone" defaultValue={member?.phone} required className="mt-1 w-full rounded-md border border-border px-3 py-2" /></label>
      <label className="text-sm">이메일<input name="email" type="email" defaultValue={member?.email ?? ""} className="mt-1 w-full rounded-md border border-border px-3 py-2" /></label>
      <label className="text-sm">주소<input name="address" defaultValue={member?.address ?? ""} className="mt-1 w-full rounded-md border border-border px-3 py-2" /></label>
      <label className="text-sm">가족 연결<select name="householdId" defaultValue={member?.householdId ?? ""} className="mt-1 w-full rounded-md border border-border px-3 py-2"><option value="">선택 안함</option>{households.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}</select></label>
      <label className="text-sm">교구<select name="districtId" defaultValue={member?.districtId ?? ""} className="mt-1 w-full rounded-md border border-border px-3 py-2"><option value="">선택 안함</option>{districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
      <label className="text-sm">목장<select name="groupId" defaultValue={member?.groupId ?? ""} className="mt-1 w-full rounded-md border border-border px-3 py-2"><option value="">선택 안함</option>{groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select></label>
      <label className="text-sm">등록일<input name="registeredAt" type="date" defaultValue={(member?.registeredAt ?? new Date()).toISOString().slice(0,10)} className="mt-1 w-full rounded-md border border-border px-3 py-2" /></label>
      <label className="text-sm">직분<input name="position" defaultValue={member?.position ?? ""} className="mt-1 w-full rounded-md border border-border px-3 py-2" /></label>
      <label className="text-sm">상태 태그<select name="statusTag" defaultValue={member?.statusTag ?? "등록대기"} className="mt-1 w-full rounded-md border border-border px-3 py-2">{STATUS_TAGS.map(t => <option key={t} value={t}>{t}</option>)}</select></label>
      <label className="text-sm lg:col-span-2">메모<textarea name="notes" defaultValue={member?.notes ?? ""} className="mt-1 w-full rounded-md border border-border px-3 py-2" /></label>
      <label className="flex items-center gap-2 text-sm"><input name="requiresFollowUp" type="checkbox" defaultChecked={member?.requiresFollowUp} /> 후속관리 필요</label>
      <label className="flex items-center gap-2 text-sm"><input name="isDeleted" type="checkbox" defaultChecked={member?.isDeleted} /> 소프트 삭제</label>
      <div className="lg:col-span-2"><Button type="submit">저장</Button></div>
    </form>
  );
}
