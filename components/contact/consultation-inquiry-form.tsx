"use client";

import { useState } from "react";

const concernTypes = [
  "학생 진로/과목 선택이 막혔습니다",
  "이력서·면접에서 내 경험이 약해 보입니다",
  "퇴사/이직/창업 선택을 정리하고 싶습니다",
  "재취업·전직 방향을 다시 잡고 싶습니다",
  "AI를 내 커리어에 어떻게 붙일지 모르겠습니다",
  "아직 모르겠지만 지금 선택이 막혔습니다",
];

const stages = ["학생/부모", "20대 커리어", "재직 중", "전환 준비", "40~50대 후반전 커리어"];
const consultationTypes = ["30분 방향 진단", "학생 진로", "이력서/면접", "재취업/전직", "AI 커리어 적용"];

type InquiryStatus = { type: "idle" } | { type: "success"; message: string; inquiryId?: string } | { type: "error"; message: string };

const fieldClass = "min-h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none placeholder:text-white/32 focus:border-[#ff6b35]/55";

function optionClass(active: boolean, shape: "pill" | "card" = "card") {
  const radius = shape === "pill" ? "rounded-full" : "rounded-2xl";
  return `${radius} border px-4 text-sm transition ${shape === "pill" ? "py-2.5" : "py-3 text-left"} ${active ? "border-[#ff6b35]/70 bg-[#ff6b35]/16 text-white shadow-[0_10px_28px_rgba(255,107,53,0.08)]" : "border-white/12 bg-white/[0.04] text-white/78 hover:border-[#ff6b35]/40 hover:bg-[#ff6b35]/10"}`;
}

export function ConsultationInquiryForm() {
  const [concernType, setConcernType] = useState(concernTypes[0]);
  const [stage, setStage] = useState(stages[0]);
  const [consultationType, setConsultationType] = useState(consultationTypes[0]);
  const [status, setStatus] = useState<InquiryStatus>({ type: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "idle" });
    setIsSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      contact: String(formData.get("contact") ?? "").trim(),
      concernType,
      stage,
      consultationType,
      message: String(formData.get("message") ?? "").trim(),
      referenceUrl: String(formData.get("referenceUrl") ?? "").trim(),
      preferredSchedule: String(formData.get("preferredSchedule") ?? "").trim(),
      companyWebsite: String(formData.get("companyWebsite") ?? "").trim(),
    };
    try {
      const response = await fetch("/api/contact/consultation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "방향 진단 신청을 접수하지 못했습니다.");
      form.reset();
      setConcernType(concernTypes[0]);
      setStage(stages[0]);
      setConsultationType(consultationTypes[0]);
      setStatus({ type: "success", message: data?.message || "30분 방향 진단 신청이 접수되었습니다.", inquiryId: data?.inquiryId });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "방향 진단 신청을 접수하지 못했습니다." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form onSubmit={handleSubmit} className="grid gap-8">
    <div><label className="text-sm font-bold text-white">지금 막힌 선택은 무엇인가요?</label><div className="mt-4 flex flex-wrap gap-3">{concernTypes.map((item) => <button key={item} type="button" onClick={() => setConcernType(item)} className={optionClass(concernType === item, "pill")}>{item}</button>)}</div></div>
    <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm text-white/78"><span className="font-bold text-white">이름</span><input name="name" autoComplete="name" className={fieldClass} placeholder="성함 또는 닉네임" required /></label><label className="grid gap-2 text-sm text-white/78"><span className="font-bold text-white">연락처</span><input name="contact" autoComplete="email" className={fieldClass} placeholder="이메일 / 전화번호 / 카카오톡 ID" required /></label></div>
    <div className="grid gap-5 sm:grid-cols-2"><div><p className="text-sm font-bold text-white">현재 상황</p><div className="mt-4 grid gap-3">{stages.map((item) => <button key={item} type="button" onClick={() => setStage(item)} className={optionClass(stage === item)}>{item}</button>)}</div></div><div><p className="text-sm font-bold text-white">진단 주제</p><div className="mt-4 grid gap-3">{consultationTypes.map((item) => <button key={item} type="button" onClick={() => setConsultationType(item)} className={optionClass(consultationType === item)}>{item}</button>)}</div></div></div>
    <label className="grid gap-2 text-sm text-white/78"><span className="font-bold text-white">현재 상황을 자유롭게 적어주세요</span><textarea name="message" className="min-h-[190px] rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 text-white outline-none placeholder:text-white/32 focus:border-[#ff6b35]/55" placeholder={"예: 과목 선택은 했는데 진로 문장이 없습니다\n이력서에 쓸 경험은 있는데 설득력이 약합니다\n재취업을 준비해야 하는데 첫 문장을 어떻게 잡을지 모르겠습니다"} required minLength={10} /></label>
    <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm text-white/78"><span className="font-bold text-white">참고 자료</span><input name="referenceUrl" className={fieldClass} placeholder="이력서, 생기부, 포트폴리오, SNS, 노션 등" /></label><label className="grid gap-2 text-sm text-white/78"><span className="font-bold text-white">희망 시간</span><input name="preferredSchedule" className={fieldClass} placeholder="예: 평일 저녁, 토요일 오전" /></label></div>
    <input name="companyWebsite" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white/70"><p className="font-bold text-white">30분 방향 진단에서 남길 것</p><ul className="mt-3 grid gap-2 leading-6"><li>현재 막힌 선택 1개를 한 문장으로 정리합니다.</li><li>AI 시대 직업 변화 속에서 무엇을 먼저 봐야 할지 기준을 잡습니다.</li><li>다음 7일에 할 행동 3개를 제안합니다.</li></ul></div>
    {status.type !== "idle" ? <div className={`rounded-[22px] border px-4 py-4 text-sm leading-6 ${status.type === "success" ? "border-[#a8d8b3]/30 bg-[#e8fff0]/10 text-[#d9ffe4]" : "border-[#f3a6a6]/30 bg-[#fff0f0]/10 text-[#ffd6d6]"}`}><p className="font-bold">{status.type === "success" ? "접수 완료" : "접수 실패"}</p><p className="mt-1">{status.message}</p>{status.type === "success" && status.inquiryId ? <p className="mt-2 text-xs opacity-70">접수 번호: {status.inquiryId}</p> : null}</div> : null}
    <div className="grid gap-3"><button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-[#080b12] transition hover:bg-[#ff6b35] hover:text-white disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "접수 중..." : "30분 방향 진단 신청"}</button><p className="text-xs leading-6 text-white/52">접수 후 현재 상황에 맞는 시작점을 먼저 안내드립니다.</p></div>
  </form>;
}
