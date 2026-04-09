import { Button } from "@/components/ui/button";
import { STATUS_TAGS } from "@/lib/constants";
import { Gender, type District, type Group, type Household, type Member } from "@prisma/client";

interface WorkspaceMemberFormProps {
  member?: Member;
  action: (formData: FormData) => Promise<void>;
  districts: District[];
  groups: Group[];
  households: Household[];
}

export function WorkspaceMemberForm({ member, action, districts, groups, households }: WorkspaceMemberFormProps) {
  return (
    <form action={action} className="grid grid-cols-1 gap-4 rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] lg:grid-cols-2">
      <label className="text-sm font-medium text-[#3f3528]">이름<input name="name" defaultValue={member?.name} required className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#d6c3a1] focus:bg-white" /></label>
      <label className="text-sm font-medium text-[#3f3528]">성별<select name="gender" defaultValue={member?.gender ?? Gender.OTHER} className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#d6c3a1] focus:bg-white"><option value={Gender.MALE}>남성</option><option value={Gender.FEMALE}>여성</option><option value={Gender.OTHER}>기타</option></select></label>
      <label className="text-sm font-medium text-[#3f3528]">생년월일<input name="birthDate" type="date" defaultValue={member?.birthDate?.toISOString().slice(0,10)} required className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#d6c3a1] focus:bg-white" /></label>
      <label className="text-sm font-medium text-[#3f3528]">연락처<input name="phone" defaultValue={member?.phone} required className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#d6c3a1] focus:bg-white" /></label>
      <label className="text-sm font-medium text-[#3f3528]">이메일<input name="email" type="email" defaultValue={member?.email ?? ""} className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#d6c3a1] focus:bg-white" /></label>
      <label className="text-sm font-medium text-[#3f3528]">주소<input name="address" defaultValue={member?.address ?? ""} className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#d6c3a1] focus:bg-white" /></label>
      <label className="text-sm font-medium text-[#3f3528]">가족<select name="householdId" defaultValue={member?.householdId ?? ""} className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#d6c3a1] focus:bg-white"><option value="">선택 안함</option>{households.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}</select><span className="mt-1 block text-xs text-[#8C7A5B]">설정에서 기본값 관리</span></label>
      <label className="text-sm font-medium text-[#3f3528]">교구<select name="districtId" defaultValue={member?.districtId ?? ""} className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#d6c3a1] focus:bg-white"><option value="">선택 안함</option>{districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select><span className="mt-1 block text-xs text-[#8C7A5B]">설정에서 기본값 관리</span></label>
      <label className="text-sm font-medium text-[#3f3528]">목장<select name="groupId" defaultValue={member?.groupId ?? ""} className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#d6c3a1] focus:bg-white"><option value="">선택 안함</option>{groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select><span className="mt-1 block text-xs text-[#8C7A5B]">설정에서 기본값 관리</span></label>
      <label className="text-sm font-medium text-[#3f3528]">등록일<input name="registeredAt" type="date" defaultValue={(member?.registeredAt ?? new Date()).toISOString().slice(0,10)} className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#d6c3a1] focus:bg-white" /></label>
      <label className="text-sm font-medium text-[#3f3528]">직분<input name="position" defaultValue={member?.position ?? ""} className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#d6c3a1] focus:bg-white" /></label>
      <label className="text-sm font-medium text-[#3f3528]">상태 태그<select name="statusTag" defaultValue={member?.statusTag ?? "등록대기"} className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#d6c3a1] focus:bg-white">{STATUS_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}</select></label>
      <label className="text-sm font-medium text-[#3f3528]">직업<input name="currentJob" defaultValue={member?.currentJob ?? ""} className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#d6c3a1] focus:bg-white" /></label>
      <label className="text-sm font-medium text-[#3f3528]">이전 교회<input name="previousChurch" defaultValue={member?.previousChurch ?? ""} className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#d6c3a1] focus:bg-white" /></label>
      <label className="text-sm font-medium text-[#3f3528]">이전 신앙<input name="previousFaith" defaultValue={member?.previousFaith ?? ""} className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#d6c3a1] focus:bg-white" /></label>
      <label className="text-sm font-medium text-[#3f3528]">침례/세례<input name="baptismStatus" defaultValue={member?.baptismStatus ?? ""} className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#d6c3a1] focus:bg-white" /></label>
      <label className="text-sm font-medium text-[#3f3528] lg:col-span-2">메모<textarea name="notes" defaultValue={member?.notes ?? ""} className="mt-1 min-h-[120px] w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#d6c3a1] focus:bg-white" /></label>
      <label className="flex items-center gap-2 text-sm font-medium text-[#5f564b]"><input name="requiresFollowUp" type="checkbox" defaultChecked={member?.requiresFollowUp} /> 관리 필요</label>
      <div className="lg:col-span-2"><Button type="submit">저장</Button></div>
    </form>
  );
}
