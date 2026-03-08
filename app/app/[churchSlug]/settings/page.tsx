import { requireWorkspaceMembership } from "@/lib/church-context";

export default async function WorkspaceSettingsPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) {
    return (
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-lg font-semibold">접근 권한이 없습니다</h2>
        <p className="mt-2 text-sm text-muted-foreground">워크스페이스 선택 화면으로 돌아가 다시 시도해주세요.</p>
      </section>
    );
  }

  const church = membership.church;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{church.name} · 워크스페이스 설정</h2>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold">기본 정보</h3>
        <p className="mt-2 text-sm text-muted-foreground">교회 이름, 타임존, 워크스페이스 슬러그를 관리하는 영역입니다.</p>
        <div className="mt-3 rounded-md border border-border bg-muted p-3 text-xs text-muted-foreground">설정 편집 기능은 준비 중입니다.</div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold">구독 / 플랜</h3>
        <p className="mt-2 text-sm text-muted-foreground">플랜 변경, 결제 이력, 사용량 관리 영역입니다.</p>
        <div className="mt-3 rounded-md border border-border bg-muted p-3 text-xs text-muted-foreground">결제 연동 기능은 준비 중입니다.</div>
      </div>
    </section>
  );
}
