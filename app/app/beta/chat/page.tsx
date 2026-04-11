import { ChatCommandForm } from "./chat-command-form";

export default function BetaChatPage() {
  return (
    <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center px-4 py-8 text-[#171717] sm:px-6 lg:px-8">
      <div className="w-full max-w-[980px]">
        <div className="text-center">
          <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">SOOM / CHAT</p>
          <h1 className="mt-6 text-[2.2rem] font-semibold tracking-[-0.05em] text-[#1a1714] sm:text-[2.8rem]">
            준비되면 얘기해 줘.
          </h1>
          <p className="mx-auto mt-4 max-w-[620px] text-sm leading-7 text-[#645a50] sm:text-[15px]">
            사람 등록, 심방 기록, 기도 요청, 후속조치를 자연스럽게 적으면 숨이 운영 흐름으로 정리하는 방향으로 가고 있어.
          </p>
        </div>

        <div className="mt-12 rounded-[32px] border border-[#e9dfd2] bg-[linear-gradient(180deg,#fbfaf7_0%,#f4eee6_100%)] p-4 shadow-[0_24px_60px_rgba(66,38,12,0.06)] sm:p-5">
          <ChatCommandForm />
        </div>
      </div>
    </div>
  );
}
