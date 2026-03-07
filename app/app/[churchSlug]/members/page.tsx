import { getChurchBySlug } from "@/lib/church-context";

export default async function ChurchMembersPage({ params }: { params: { churchSlug: string } }) {
  const church = await getChurchBySlug(params.churchSlug);

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h2 className="text-lg font-semibold">{church.name} · 교인</h2>
      <p className="mt-2 text-sm text-muted-foreground">멀티테넌트 churchSlug 라우트 자리. 실제 쿼리는 churchId 스코프 적용 예정.</p>
    </section>
  );
}
