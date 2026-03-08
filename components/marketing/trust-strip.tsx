export function TrustStrip() {
  const items = [
    "교회별 워크스페이스 분리",
    "멀티테넌트 데이터 구조",
    "교적·신청·공지 통합",
    "모바일 관리자 대응",
  ];

  return (
    <section className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
          {item}
        </span>
      ))}
    </section>
  );
}
