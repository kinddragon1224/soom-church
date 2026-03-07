import { MemberForm } from "@/components/members/member-form";

export default function NewMemberPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">교인 등록</h1>
      <MemberForm />
    </div>
  );
}
