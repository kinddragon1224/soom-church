import Link from "next/link";
import SiteHeader from "@/components/site-header";

const lenses = [
  { title: "READ", desc: "AI, 직업 변화, 교육/채용 신호와 개인의 현재 위치를 같이 읽습니다." },
  { title: "TRANSLATE", desc: "불안과 경험을 과목, 직무, 경력, 포트폴리오 언어로 바꿉니다." },
  { title: "ACT", desc: "다음 7일에 확인할 행동, 문장, 작은 실험으로 정리합니다." },
];

const principles = [
  "점술처럼 맞히지 않습니다. 흐름과 기준을 함께 봅니다.",
  "정보를 더 쌓기보다, 지금 선택할 기준을 먼저 만듭니다.",
  "학생·20대·중장년의 선택 문제를 각각 다른 언어로 읽습니다.",
  "방향 진단의 끝에는 다음 7일에 할 행동이 남아야 합니다.",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#080b12] text-white">
      <section className="border-b border-white/10 bg-[#080b12]">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="about" ctaHref="/contact" ctaLabel="30분 방향 진단 신청" />
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,91,46,0.2)_0%,rgba(255,91,46,0)_30%),radial-gradient(circle_at_88%_10%,rgba(79,123,255,0.18)_0%,rgba(79,123,255,0)_28%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff6b35]">About Soom</p>
          <h1 className="mt-5 max-w-6xl text-[3.05rem] font-black leading-[0.96] tracking-[-0.085em] sm:text-[5.3rem]">
            숨은 AI 시대의
            <br />
            진로·직업·커리어를 읽는
            <br />
            방향 진단 서비스입니다.
          </h1>
          <div className="mt-9 grid max-w-5xl gap-5 text-base leading-8 text-white/66 lg:grid-cols-2">
            <p>
              선택이 막히는 순간은 대부분 정보가 부족해서가 아닙니다. 과목, 이력서, 퇴사, 재취업, AI 활용 앞에서 무엇을 기준으로 봐야 할지 흐려졌기 때문입니다.
            </p>
            <p>
              숨은 학생 진로, 20대 커리어, 중장년 후반전 커리어를 AI 시대의 직업 변화 속에서 다시 읽고, 지금 할 수 있는 다음 행동으로 정리합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#050507]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-3 lg:px-10 lg:py-24">
          {lenses.map((item) => (
            <article key={item.title} className="rounded-[34px] border border-white/10 bg-white/[0.045] p-7">
              <h2 className="text-[2.35rem] font-black tracking-[-0.07em] text-[#ff6b35]">{item.title}</h2>
              <p className="mt-5 text-sm leading-7 text-white/68">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#080b12]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-10 lg:py-24">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff6b35]">Standard</p>
            <h2 className="mt-5 text-[2.45rem] font-black leading-[1] tracking-[-0.074em] sm:text-[4rem]">
              정답보다 먼저,
              <br />
              기준을 세웁니다.
            </h2>
          </div>
          <div className="grid gap-3">
            {principles.map((item) => (
              <div key={item} className="rounded-[24px] border border-white/10 bg-white/[0.045] px-5 py-5 text-sm font-bold leading-7 text-white/72">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#050507]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-14 sm:px-8 lg:flex-row lg:items-end lg:px-10">
          <h2 className="max-w-4xl text-[2.4rem] font-black leading-[1] tracking-[-0.074em] sm:text-[4.1rem]">
            지금 막힌 선택을 하나만 가져오세요.
          </h2>
          <Link href="/contact" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-[#080b12] transition hover:bg-[#ff6b35] hover:text-white">
            30분 방향 진단 신청
          </Link>
        </div>
      </section>
    </main>
  );
}
