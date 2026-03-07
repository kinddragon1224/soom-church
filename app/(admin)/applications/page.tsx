import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function ApplicationsPage() {
  const applications = await prisma.application.findMany({ include: { form: true }, orderBy: { createdAt: "desc" } });

  async function updateStatus(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    const status = String(formData.get("status"));
    await prisma.application.update({ where: { id }, data: { status: status as any } });
    await prisma.activityLog.create({ data: { action: "APPLICATION_UPDATED", targetType: "Application", targetId: id } });
    revalidatePath("/applications");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">신청 관리</h1>
      <div className="rounded-xl border border-border bg-white">
        <table>
          <thead><tr><th>신청자</th><th>폼</th><th>상태</th><th>처리</th></tr></thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.applicantName}</td>
                <td>{app.form.title}</td>
                <td>{app.status}</td>
                <td>
                  <form action={updateStatus} className="flex gap-2">
                    <input type="hidden" name="id" value={app.id} />
                    <select name="status" defaultValue={app.status} className="rounded border border-border px-2 py-1 text-xs">
                      <option value="PENDING">PENDING</option>
                      <option value="IN_REVIEW">IN_REVIEW</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                    <button className="rounded border border-border px-2 py-1 text-xs">저장</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
