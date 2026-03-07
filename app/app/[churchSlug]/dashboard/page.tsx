import { getChurchBySlug } from "@/lib/church-context";

export default async function ChurchDashboardPage({ params }: { params: { churchSlug: string } }) {
  const church = await getChurchBySlug(params.churchSlug);

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h2 className="text-lg font-semibold">{church.name} 대시보드</h2>
      <p className="mt-2 text-sm text-muted-foreground">churchSlug 기반 앱 라우팅 울타리 1차 완료. 다음 단계에서 실제 데이터 조회를 churchId 스코프로 전환합니다.</p>
    </section>
  );
}
