import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function DistrictsPage() {
  const districts = await prisma.district.findMany({ include: { groups: true, _count: { select: { members: true } } } });

  async function createDistrict(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "");
    const leadName = String(formData.get("leadName") || "") || null;
    if (!name) return;
    await prisma.district.create({ data: { name, leadName } });
    await prisma.activityLog.create({ data: { action: "DISTRICT_CREATED", targetType: "District" } });
    revalidatePath("/districts");
  }

  async function createGroup(formData: FormData) {
    "use server";
    const districtId = String(formData.get("districtId") || "");
    const name = String(formData.get("name") || "");
    if (!districtId || !name) return;
    await prisma.group.create({ data: { districtId, name } });
    await prisma.activityLog.create({ data: { action: "GROUP_CREATED", targetType: "Group" } });
    revalidatePath("/districts");
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
      <section className="rounded-xl border border-border bg-white p-3 sm:p-4">
        <h1 className="text-lg font-semibold">교구 관리</h1>
        <form action={createDistrict} className="mt-3 flex gap-2">
          <input name="name" placeholder="교구명" className="w-full rounded border border-border px-3 py-2 text-sm" />
          <input name="leadName" placeholder="담당자" className="w-full rounded border border-border px-3 py-2 text-sm" />
          <button className="rounded bg-primary px-3 py-2 text-sm text-white">추가</button>
        </form>
        <ul className="mt-4 space-y-2 text-sm">
          {districts.map((d) => (
            <li key={d.id} className="rounded border border-border p-2">
              <div className="font-medium">{d.name} ({d._count.members}명)</div>
              <div className="text-muted-foreground">담당: {d.leadName ?? "-"}</div>
              <div className="mt-1 text-xs">목장: {d.groups.map((g) => g.name).join(", ") || "없음"}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-white p-3 sm:p-4">
        <h2 className="text-lg font-semibold">목장 추가</h2>
        <form action={createGroup} className="mt-3 space-y-2">
          <select name="districtId" className="w-full rounded border border-border px-3 py-2 text-sm">
            <option value="">교구 선택</option>
            {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <input name="name" placeholder="목장명" className="w-full rounded border border-border px-3 py-2 text-sm" />
          <button className="rounded bg-primary px-3 py-2 text-sm text-white">목장 생성</button>
        </form>
      </section>
    </div>
  );
}
