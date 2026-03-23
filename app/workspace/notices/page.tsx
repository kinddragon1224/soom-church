const noticeStats = [
  { label: "전체 공지", value: "12", delta: "+2 이번 주" },
  { label: "발행중", value: "5", delta: "채널 3개" },
  { label: "예약", value: "3", delta: "이번 주 발송" },
  { label: "초안", value: "4", delta: "검토 필요" },
];

const notices = [
  { title: "주일 예배 안내", state: "발행중", channel: "문자", audience: "전체 교인", nextStep: "오후 6시 재발송 없음" },
  { title: "수련회 신청 오픈", state: "예약", channel: "카카오톡", audience: "청년부", nextStep: "수요일 오전 발송" },
  { title: "청년부 모임 공지", state: "초안", channel: "푸시", audience: "청년부 리더", nextStep: "문구 검토 대기" },
  { title: "봉사자 리마인드", state: "발행중", channel: "문자", audience: "봉사팀", nextStep: "오늘 저녁까지 확인" },
];

const channelHealth = [
  { title: "카카오톡", desc: "예약 2건, 이미지 포함 공지 1건", status: "정상" },
  { title: "문자", desc: "긴급 공지용 템플릿 3개 준비", status: "준비" },
  { title: "푸시", desc: "앱 미설치 인원 제외 필요", status: "점검" },
];

const scheduleFlow = [
  { title: "대상 선택", desc: "교구, 부서, 행사 신청자처럼 보낼 대상을 먼저 고릅니다." },
  { title: "문구 조정", desc: "채널별 길이와 톤에 맞게 메시지를 다듬습니다." },
  { title: "예약 발송", desc: "예배 전, 행사 전, 리마인드 시점에 맞춰 예약합니다." },
  { title: "도달 확인", desc: "읽음과 응답 흐름을 보고 후속 공지를 이어갑니다." },
];

const reviewQueue = [
  { title: "수련회 신청 오픈", note: "신청 링크와 마감일 재확인", due: "오늘" },
  { title: "봉사자 리마인드", note: "예배 시간 변경 반영 여부 확인", due: "이번 주" },
  { title: "청년부 모임 공지", note: "푸시 제목 길이 조정 필요", due: "검토" },
];

const handoffRoutes = [
  { title: "신청자 목록 → 사람 흐름", desc: "행사 신청 공지가 나간 뒤 반응한 사람은 후속 연락 대상에 바로 이어집니다.", target: "사람" },
  { title: "검토 완료 → 작업 흐름", desc: "문구와 링크 검토가 끝나면 담당자 확인 태스크로 넘겨 누락을 줄입니다.", target: "작업 흐름" },
  { title: "공지 배포 → 콘텐츠 재사용", desc: "행사 공지 문구는 썸네일 문구와 영상 캡션으로 다시 이어질 수 있습니다.", target: "콘텐츠" },
];

const automationRules = [
  { title: "예약 24시간 전 재확인", note: "발송 전날 링크와 일정이 바뀌었는지 마지막으로 점검합니다.", state: "ready" },
  { title: "채널별 길이 가이드", note: "문자, 카카오톡, 푸시마다 제목·본문 길이 기준을 붙입니다.", state: "draft" },
  { title: "미열람 후속 알림", note: "중요 공지를 읽지 않은 대상만 다시 묶어 후속 안내를 준비합니다.", state: "review" },
];

export default function WorkspaceNoticesPage() {
  return (
    <div className="flex flex-col gap-6 text-[#121212]">
      <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="overflow-hidden rounded-[30px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] tracking-[0.2em] text-white/46">COMMUNICATION FLOW</p>
                <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] text-white/70">예약 발송 중심</span>
              </div>
              <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-[2.8rem]">
                공지가 흩어지지 않도록
                <br />
                대상과 발송 시점을 함께 봅니다
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                채널별 공지 초안, 예약 발송, 후속 안내를 한 흐름으로 정리해서 교회 운영 메시지가 누락되지 않게 돕습니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[250px] lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">예약 3건</span>
              <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/12 px-3 py-1.5 text-xs text-[#f1dfb2]">검토 필요 2건</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">채널 3종</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 xl:grid-cols-[1fr_230px]">
            <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 sm:p-5">
              <p className="text-[11px] tracking-[0.18em] text-white/42">NEXT SENDS</p>
              <div className="mt-4 grid gap-2 text-sm text-white/82 sm:grid-cols-3">
                <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">수련회 안내 수요일 예약</div>
                <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">봉사자 리마인드 오늘 발송</div>
                <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">예배 안내 상단 고정</div>
              </div>
            </div>
            <div className="grid gap-3">
              <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-white px-5 text-sm font-semibold text-[#09111f]">
                메시지 작성
              </button>
              <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-[14px] border border-white/14 bg-white/5 px-5 text-sm font-medium text-white">
                예약 보기
              </button>
            </div>
          </div>
        </div>

        <section className="rounded-[30px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">MESSAGE FLOW</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">공지 발송 구조</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">4단계</span>
          </div>
          <div className="mt-4 grid gap-3">
            {scheduleFlow.map((item, index) => (
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
        {noticeStats.map((item) => (
          <div key={item.label} className="rounded-[20px] border border-[#E7E0D4] bg-[#FCFBF8] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs text-[#8C7A5B]">{item.label}</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-2xl font-semibold text-[#121212]">{item.value}</p>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
        <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#121212]">메시지 리스트</h2>
            <span className="text-xs text-[#8C7A5B]">채널 포함</span>
          </div>
          <div className="mt-4 grid gap-3">
            {notices.map((notice) => (
              <div key={notice.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-[#121212]">{notice.title}</p>
                      <span className="rounded-full border border-[#E7E0D4] bg-[#F6F1E5] px-3 py-1 text-[11px] text-[#8C6A2E]">{notice.state}</span>
                    </div>
                    <p className="mt-1 text-xs text-[#5F564B]">채널: {notice.channel} · 대상: {notice.audience}</p>
                  </div>
                  <span className="text-[11px] text-[#8C7A5B]">{notice.nextStep}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">CHANNEL HEALTH</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">채널 상태</h2>
            <div className="mt-4 grid gap-3">
              {channelHealth.map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#121212]">{item.title}</p>
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{item.status}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">REVIEW QUEUE</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">검토 대기</h2>
            <div className="mt-4 grid gap-3">
              {reviewQueue.map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#121212]">{item.title}</p>
                    <span className="text-[11px] text-[#8C7A5B]">{item.due}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">NEXT HANDOFF</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">다음 모듈로 넘길 흐름</h2>
            <div className="mt-4 grid gap-3">
              {handoffRoutes.map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#121212]">{item.title}</p>
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.target}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">AUTOMATION READY</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">자동화로 붙일 수 있는 규칙</h2>
            <div className="mt-4 grid gap-3">
              {automationRules.map((item) => (
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
