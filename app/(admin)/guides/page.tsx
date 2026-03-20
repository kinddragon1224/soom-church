export default function GuidesAdminPage() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <section className="rounded-xl border border-border bg-white p-4 sm:p-5">
        <h1 className="text-lg font-semibold">AI 안내서</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          지금은 게시판 구조를 먼저 연결해둔 상태야. 데이터베이스 마이그레이션이 적용되면 여기서 글을 작성하고 발행할 수 있게 열릴 예정이야.
        </p>
      </section>

      <section className="rounded-xl border border-border bg-white p-4 sm:p-5">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">STATUS</p>
        <h2 className="mt-2 text-base font-semibold">준비 중</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>AI 안내서 목록/상세/글쓰기 구조는 설계됨</li>
          <li>현재는 데이터베이스 테이블 적용 전이라 임시 안내 화면으로 막아둠</li>
          <li>마이그레이션 적용 후 글쓰기/발행 기능을 다시 열 예정</li>
        </ul>
      </section>
    </div>
  );
}
