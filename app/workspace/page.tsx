export default function WorkspacePage() {
  return (
    <div className="flex flex-col gap-6 text-[#121212]">
      <section className="overflow-hidden rounded-[30px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_58%,#243252_100%)] text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
        <div className="grid gap-px bg-white/10 xl:grid-cols-[minmax(0,1.2fr)_420px]">
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] tracking-[0.2em] text-white/46">WORKSPACE HOME</p>
              <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] text-white/70">운영 모드</span>
            </div>
            <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[2.8rem]">
              오늘 처리할 흐름만
              <br />
              바로 정리한다
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/66">후속 연락, 공지, 작업, 콘텐츠 흐름을 한 화면에서 점검하는 데모 워크스페이스입니다.</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-[18px] border border-white/10 bg-white/8 px-4 py-3">
                <p className="text-[11px] tracking-[0.16em] text-white/42">WORKSPACE</p>
                <p className="mt-2 text-sm font-semibold text-white">숨 개발용 워크스페이스</p>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/8 px-4 py-3">
                <p className="text-[11px] tracking-[0.16em] text-white/42">PLAN</p>
                <p className="mt-2 text-sm font-semibold text-[#f1dfb2]">무료 플랜</p>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/8 px-4 py-3">
                <p className="text-[11px] tracking-[0.16em] text-white/42">QUICK OPEN</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <a href="/workspace/people" className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-white/82">사람</a>
                  <a href="/workspace/notices" className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-white/82">공지</a>
                  <a href="/workspace/content" className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-white/82">콘텐츠</a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-white/10">
            <div className="bg-white/6 px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] tracking-[0.18em] text-white/46">TODAY BOARD</p>
                  <h2 className="mt-2 text-lg font-semibold text-white">지금 바로 볼 항목</h2>
                </div>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] text-white/72">우선 3개</span>
              </div>
            </div>

            <div className="divide-y divide-white/10 bg-white/4">
              {[
                { lane: "지금", title: "후속 연락 3건 확인", desc: "48시간 안에 응답이 필요한 사람 흐름입니다.", cta: "사람 보기", href: "/workspace/people" },
                { lane: "다음", title: "예약 공지 4건 점검", desc: "수요일·주말 발송 전 마지막 확인이 필요합니다.", cta: "공지 보기", href: "/workspace/notices" },
                { lane: "검토", title: "콘텐츠 승인 2건", desc: "썸네일과 자막 톤만 맞추면 바로 배포할 수 있습니다.", cta: "콘텐츠 보기", href: "/workspace/content" },
              ].map((item) => (
                <a key={item.title} href={item.href} className="grid gap-2 px-5 py-4 transition hover:bg-white/6 sm:grid-cols-[58px_minmax(0,1fr)_84px] sm:items-center sm:px-6">
                  <p className="text-[11px] tracking-[0.18em] text-white/46">{item.lane}</p>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-white/64">{item.desc}</p>
                  </div>
                  <p className="text-xs font-medium text-[#f1dfb2] sm:text-right">{item.cta}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
