const contentStats = [
  { label: "전체 요청", value: "18", delta: "+3 이번 주" },
  { label: "기획", value: "4", delta: "브리프 정리중" },
  { label: "제작중", value: "7", delta: "오늘 2건" },
  { label: "검토", value: "3", delta: "배포 대기" },
];

const contentItems = [
  { title: "설교 쇼츠 3건", state: "제작중", owner: "콘텐츠팀", output: "릴스·유튜브 쇼츠" },
  { title: "행사 랜딩 페이지", state: "기획", owner: "최재성", output: "신청 페이지" },
  { title: "유튜브 채널 구조 정리", state: "완료", owner: "김선용", output: "채널 세팅" },
  { title: "부활절 홍보영상", state: "검토", owner: "콘텐츠팀", output: "행사 홍보" },
];

const requests = [
  { title: "주일 예배 쇼츠 편집 요청", meta: "설교 1편 → 클립 3개" },
  { title: "수련회 참가 신청 페이지 제작", meta: "랜딩 + 신청 안내" },
  { title: "유튜브 썸네일 스타일 정리", meta: "청년부 채널 기준" },
];

const productionFlow = [
  { title: "브리프 수집", desc: "설교, 행사, 공지 맥락을 먼저 받습니다." },
  { title: "형식 결정", desc: "쇼츠, 랜딩, 썸네일처럼 결과물 형식을 고릅니다." },
  { title: "제작 진행", desc: "자막, 문구, 비주얼을 같은 결로 맞춥니다." },
  { title: "배포 연결", desc: "공지와 업로드 흐름까지 이어서 마무리합니다." },
];

const outputBoards = [
  { title: "설교 → 쇼츠", desc: "주일 설교를 짧은 영상 3개로 자르고 자막 톤을 맞춥니다.", status: "제작중" },
  { title: "행사 → 랜딩", desc: "행사 소개, 일정, 신청 안내를 한 페이지에 정리합니다.", status: "기획" },
  { title: "채널 → 운영 세팅", desc: "썸네일, 제목 규칙, 업로드 루틴을 구조화합니다.", status: "완료" },
];

const deliveryTracks = [
  {
    title: "설교 → 쇼츠 → 공지",
    desc: "짧은 영상과 안내 문구를 한 묶음으로 배포합니다.",
    meta: "반복형",
    owner: "콘텐츠팀",
    due: "예배 후 24시간",
    action: "클립 확정 후 공지 문구와 같이 전달",
  },
  {
    title: "행사 → 랜딩 → 리마인드",
    desc: "행사 소개 페이지와 신청 안내를 같은 흐름으로 맞춥니다.",
    meta: "캠페인",
    owner: "김선용",
    due: "행사 전 주",
    action: "랜딩 공개 후 리마인드 흐름 연결",
  },
  {
    title: "채널 운영 → 썸네일 → 업로드",
    desc: "유튜브 운영 세팅과 결과물 규칙을 같이 관리합니다.",
    meta: "루틴",
    owner: "미디어팀",
    due: "업로드 당일",
    action: "썸네일/제목 규칙 확인 후 업로드",
  },
];

const productionRules = [
  { title: "브리프 없이 제작 시작 금지", note: "설교 맥락, 행사 일정, 공지 목적이 먼저 정리돼야 합니다.", state: "rule" },
  { title: "검토 단계 1회 집중", note: "자막, 썸네일, 문구를 한 번에 모아 검토해 왕복을 줄입니다.", state: "review" },
  { title: "배포 링크 handoff", note: "완료된 결과물은 공지 모듈에서 바로 쓸 수 있게 링크를 넘깁니다.", state: "handoff" },
];

export default function WorkspaceContentPage() {
  return (
    <div className="flex flex-col gap-6 text-[#121212]">
      <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="overflow-hidden rounded-[30px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] tracking-[0.2em] text-white/46">CONTENT STUDIO</p>
                <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] text-white/70">제작 파이프라인 중심</span>
              </div>
              <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-[2.8rem]">
                설교와 행사 요청이 들어오면
                <br />
                결과물까지 한 흐름으로 이어갑니다
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                쇼츠, 행사 랜딩, 유튜브 운영 요청을 따로 흩어두지 않고 같은 콘텐츠 파이프라인에서 관리하는 화면입니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[250px] lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">제작중 7건</span>
              <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/12 px-3 py-1.5 text-xs text-[#f1dfb2]">검토 3건</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">출력 유형 3종</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 xl:grid-cols-[1fr_230px]">
            <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 sm:p-5">
              <p className="text-[11px] tracking-[0.18em] text-white/42">CURRENT OUTPUTS</p>
              <div className="mt-4 grid gap-2 text-sm text-white/82 sm:grid-cols-3">
                <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">설교 쇼츠 3건</div>
                <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">수련회 랜딩 시안</div>
                <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">부활절 영상 검토</div>
              </div>
            </div>
            <div className="grid gap-3">
              <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-white px-5 text-sm font-semibold text-[#09111f]">
                콘텐츠 요청
              </button>
              <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-[14px] border border-white/14 bg-white/5 px-5 text-sm font-medium text-white">
                파이프라인 보기
              </button>
            </div>
          </div>
        </div>

        <section className="rounded-[30px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">CONTENT FLOW</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">제작 구조</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">4단계</span>
          </div>
          <div className="mt-4 grid gap-3">
            {productionFlow.map((item, index) => (
              <div key={item.title} className="rounded-[18px] border border-[#ece6dc] bg-white p-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e6dfd5] bg-[#f8f2e5] text-xs font-semibold text-[#8C6A2E]">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {contentStats.map((item) => (
          <div key={item.label} className="rounded-[20px] border border-[#E7E0D4] bg-[#FCFBF8] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs text-[#8C7A5B]">{item.label}</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-2xl font-semibold text-[#121212]">{item.value}</p>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#121212]">콘텐츠 파이프라인</h2>
            <span className="text-xs text-[#8C7A5B]">최신순</span>
          </div>
          <div className="mt-4 grid gap-3">
            {contentItems.map((item) => (
              <div key={item.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-[#121212]">{item.title}</p>
                      <span className="rounded-full border border-[#E7E0D4] bg-[#F6F1E5] px-3 py-1 text-[11px] text-[#8C6A2E]">{item.state}</span>
                    </div>
                    <p className="mt-1 text-xs text-[#5F564B]">담당: {item.owner} · 결과물: {item.output}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">RECENT REQUESTS</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">최근 요청</h2>
            <div className="mt-4 grid gap-3">
              {requests.map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                  <p className="text-sm font-semibold text-[#121212]">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.meta}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">OUTPUT BOARDS</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">핵심 출력 흐름</h2>
            <div className="mt-4 grid gap-3">
              {outputBoards.map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#121212]">{item.title}</p>
                    <span className="text-[11px] text-[#8C7A5B]">{item.status}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">DELIVERY TRACKS</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">배포까지 이어지는 트랙</h2>
            <div className="mt-4 grid gap-3">
              {deliveryTracks.map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#121212]">{item.title}</p>
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{item.meta}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.desc}</p>
                  <div className="mt-3 grid gap-2 text-[11px] text-[#7a6d5c] sm:grid-cols-3">
                    <div className="rounded-[12px] border border-[#e6dfd5] bg-[#fcfbf8] px-3 py-2">담당: {item.owner}</div>
                    <div className="rounded-[12px] border border-[#e6dfd5] bg-[#fcfbf8] px-3 py-2">기한: {item.due}</div>
                    <div className="rounded-[12px] border border-[#e6dfd5] bg-[#fcfbf8] px-3 py-2">다음 액션: {item.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">PRODUCTION RULES</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">제작 품질 기준</h2>
            <div className="mt-4 grid gap-3">
              {productionRules.map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#121212]">{item.title}</p>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[#8C7A5B]">{item.state}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.note}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
