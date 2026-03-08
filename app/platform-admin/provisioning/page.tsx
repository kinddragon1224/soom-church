export default function PlatformAdminProvisioningPage() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">워크스페이스 생성 / 프로비저닝</h2>
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">새 교회 워크스페이스 생성은 다음 단계에서 연결됩니다.</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>교회명/슬러그 유효성 검사</li>
          <li>기본 플랜 부여(FREE)</li>
          <li>OWNER 멤버십 자동 생성</li>
          <li>초기 교적/공지 템플릿 선택</li>
        </ul>
      </div>
    </section>
  );
}
