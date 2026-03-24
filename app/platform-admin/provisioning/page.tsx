import Link from "next/link";

export default function PlatformAdminProvisioningPage() {
  const steps = [
    { title: "기본 정보", desc: "교회명, 슬러그, 시간대를 먼저 확정" },
    { title: "플랜 연결", desc: "기본 FREE 플랜으로 시작 후 상태 확인" },
    { title: "오너 계정", desc: "OWNER 멤버십과 첫 로그인 흐름 연결" },
    { title: "초기 데이터", desc: "교인/공지/조직 기본값 준비" },
  ] as const;

  return (
    <section className="space-y-4 text-[#111111]">
      <div className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
        <p className="text-[11px] tracking-[0.2em] text-white/46">PLATFORM / PROVISIONING</p>
        <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white">새 교회 워크스페이스 준비</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/66 sm:text-base">프로비저닝 화면도 단순 TODO가 아니라 실제 운영 준비 흐름을 먼저 보여주는 형태로 정리한다.</p>
      </div>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">PROVISIONING FLOW</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">현재 준비 단계</h2>
          </div>
          <Link href="/platform-admin/churches" className="rounded-[12px] border border-[#d9d2c7] bg-[#fcfbf8] px-3 py-2 text-sm font-medium text-[#111111]">교회 목록 보기</Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
              <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">STEP {String(index + 1).padStart(2, "0")}</p>
              <p className="mt-2 text-sm font-semibold text-[#111111]">{step.title}</p>
              <p className="mt-2 text-sm text-[#5f564b]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
