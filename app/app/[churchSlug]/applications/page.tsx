import { getChurchBySlug } from "@/lib/church-context";

export default async function ChurchApplicationsPage({ params }: { params: { churchSlug: string } }) {
  const church = await getChurchBySlug(params.churchSlug);

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h2 className="text-lg font-semibold">{church.name} · 신청</h2>
      <p className="mt-2 text-sm text-muted-foreground">신청 데이터의 churchId 스코프 적용을 위한 라우팅 울타리 준비 완료.</p>
    </section>
  );
}
