import Link from "next/link";

export default function BetaHomePage() {
  return (
    <div className="flex flex-col gap-5 text-[#171717]">
      <header className="rounded-[28px] border border-[#ece4d8] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:px-7">
        <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">SOOM BETA OS</p>
        <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">새 운영 개발 OS</h1>
        <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#5f564b]">
          기존 실험을 접고, 기본 구조부터 다시 세우는 새 beta입니다. 지금은 라우트와 로그인, 기본 작업 공간만 최소로 올려둔 상태입니다.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card title="Chat" body="운영 입력의 시작점" href="/app/beta/chat" />
        <Card title="World" body="월드 씬 실험 공간" href="/app/beta/world" />
        <Card title="Records" body="정리된 운영 데이터의 뼈대" href="/app/beta/records" />
      </section>
    </div>
  );
}

function Card({ title, body, href }: { title: string; body: string; href: string }) {
  return (
    <Link href={href} className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(15,23,42,0.08)]">
      <p className="text-lg font-semibold text-[#111111]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{body}</p>
    </Link>
  );
}
