import Link from "next/link";

import { ChatCommandForm } from "./chat-command-form";

export default function BetaChatPage() {
  return (
    <div className="flex flex-col gap-5 text-[#171717]">
      <header className="rounded-[28px] border border-[#ece4d8] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:px-7">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#7f7366]">
          <Link href="/app/beta" className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-3 py-1">홈</Link>
          <span>/</span>
          <Link href="/app/beta/world" className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-3 py-1">월드</Link>
          <span>/</span>
          <span className="rounded-full border border-[#e7dfd3] bg-white px-3 py-1 text-[#3f372d]">운영 입력</span>
        </div>
        <p className="mt-3 text-[10px] tracking-[0.18em] text-[#9a8b7a]">BETA / CHAT</p>
        <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">운영 입력</h1>
        <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#5f564b]">
          이제부터 chat 명령으로 목양 공간 상태를 바꾸기 시작한다. 첫 연결은 `목자 추가`다.
        </p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-[28px] border border-[#ece4d8] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:px-7">
          <ChatCommandForm />
        </div>

        <aside className="rounded-[28px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">CONNECTED SPACE</p>
          <p className="mt-3 text-lg font-semibold text-[#111111]">목양</p>
          <p className="mt-2 text-sm leading-6 text-[#5f564b]">여기서 실행한 명령이 목양 공간 카드에 바로 반영된다.</p>
          <Link href="/app/beta/world/shepherding" className="mt-4 inline-flex rounded-[14px] border border-[#e7dfd3] bg-[#faf7f2] px-4 py-2 text-sm text-[#3f372d]">
            목양 공간 보기
          </Link>
        </aside>
      </section>
    </div>
  );
}
