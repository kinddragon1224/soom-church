import { getChurchBySlug } from "@/lib/church-context";

export default async function ChurchNoticesPage({ params }: { params: { churchSlug: string } }) {
  const church = await getChurchBySlug(params.churchSlug);

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h2 className="text-lg font-semibold">{church.name} · 공지</h2>
      <p className="mt-2 text-sm text-muted-foreground">교회 워크스페이스 별 공지 영역 자리 확보. 다음 단계에서 권한/멤버십 연동 예정.</p>
    </section>
  );
}
