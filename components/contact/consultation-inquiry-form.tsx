"use client";

import { useState } from "react";

const concernTypes = [
  "AI 때문에 지금 일이 불안합니다",
  "이직/전환을 생각 중입니다",
  "내 강점을 어떻게 팔지 모르겠습니다",
  "AI로 보여줄 결과물을 만들고 싶습니다",
  "청년/교육기관 워크숍을 문의하고 싶습니다",
  "아직 모르겠지만 이야기를 나눠보고 싶습니다",
];

const stages = ["학생/취준", "재직 중", "이직 준비", "프리랜서/창업 준비", "기관/단체 담당자"];
const consultationTypes = ["1회 진단 상담", "4주 커리어 리디자인", "AI 포트폴리오 기획", "강의/워크숍 문의", "아직 미정"];

type InquiryStatus =
  | { type: "idle" }
  | { type: "success"; message: string; inquiryId?: string }
  | { type: "error"; message: string };

const fieldClass =
  "min-h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none placeholder:text-white/32 focus:border-[#f3c987]/50";

function optionClass(active: boolean, shape: "pill" | "card" = "card") {
  const radius = shape === "pill" ? "rounded-full" : "rounded-2xl";
  return `${radius} border px-4 text-sm transition ${
    shape === "pill" ? "py-2.5" : "py-3 text-left"
  } ${
    active
      ? "border-[#f3c987]/70 bg-[#f3c987]/16 text-white shadow-[0_10px_28px_rgba(243,201,135,0.08)]"
      : "border-white/12 bg-white/[0.04] text-white/78 hover:border-[#f3c987]/40 hover:bg-[#f3c987]/10"
  }`;
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
      const response = await fetch("/api/contact/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || "상담 신청을 접수하지 못했습니다.");
      }

      form.reset();
      setConcernType(concernTypes[0]);
      setStage(stages[0]);
      setConsultationType(consultationTypes[0]);
      setStatus({
        type: "success",
        message: data?.message || "상담 신청이 접수되었습니다.",
        inquiryId: data?.inquiryId,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "상담 신청을 접수하지 못했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      <div>
        <label className="text-sm font-semibold text-white">지금 마음에 제일 가까운 문장은 무엇인가요?</label>
        <div className="mt-4 flex flex-wrap gap-3">
          {concernTypes.map((item) => (
            <button key={item} type="button" onClick={() => setConcernType(item)} className={optionClass(concernType === item, "pill")}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-white/78">
          <span className="font-semibold text-white">이름</span>
          <input name="name" autoComplete="name" className={fieldClass} placeholder="편하게 불릴 이름을 적어주세요" required />
        </label>
        <label className="grid gap-2 text-sm text-white/78">
          <span className="font-semibold text-white">연락처</span>
          <input name="contact" autoComplete="email" className={fieldClass} placeholder="이메일 / 전화번호 / 카카오톡 ID" required />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-white">현재 상황</p>
          <div className="mt-4 grid gap-3">
            {stages.map((item) => (
              <button key={item} type="button" onClick={() => setStage(item)} className={optionClass(stage === item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">관심 상담</p>
          <div className="mt-4 grid gap-3">
            {consultationTypes.map((item) => (
              <button key={item} type="button" onClick={() => setConsultationType(item)} className={optionClass(consultationType === item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <label className="grid gap-2 text-sm text-white/78">
          <span className="font-semibold text-white">지금 머릿속에 있는 고민을 자유롭게 적어주세요</span>
        <textarea
          name="message"
          className="min-h-[190px] rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 text-white outline-none placeholder:text-white/32 focus:border-[#f3c987]/50"
          placeholder={"예: 요즘 제가 하던 일이 계속 괜찮을지 불안합니다\n자격증은 있는데 이걸 어떻게 일로 연결할지 모르겠습니다\n포트폴리오를 만들고 싶은데 무엇부터 해야 할지 막막합니다"}
          required
          minLength={10}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-white/78">
          <span className="font-semibold text-white">참고 자료</span>
          <input name="referenceUrl" className={fieldClass} placeholder="이력서, 포트폴리오, SNS, 노션, 링크드인 등" />
        </label>
        <label className="grid gap-2 text-sm text-white/78">
          <span className="font-semibold text-white">희망 상담 시간</span>
          <input name="preferredSchedule" className={fieldClass} placeholder="예: 평일 저녁, 토요일 오전" />
        </label>
      </div>

      <input name="companyWebsite" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white/70">
        <p className="font-semibold text-white">보내기 전에 이것만 기억해주세요</p>
        <ul className="mt-3 grid gap-2 leading-6">
          <li>문장이 조금 어수선해도 괜찮습니다.</li>
          <li>상담은 직업을 찍어주는 일보다 지금 가진 자원과 다음 행동을 정리하는 데 집중합니다.</li>
          <li>진행이 맞지 않는 경우에도 무리하게 권하지 않습니다.</li>
        </ul>
      </div>

      {status.type !== "idle" ? (
        <div
          className={`rounded-[22px] border px-4 py-4 text-sm leading-6 ${
            status.type === "success"
              ? "border-[#a8d8b3]/30 bg-[#e8fff0]/10 text-[#d9ffe4]"
              : "border-[#f3a6a6]/30 bg-[#fff0f0]/10 text-[#ffd6d6]"
          }`}
        >
          <p className="font-semibold">{status.type === "success" ? "접수 완료" : "접수 실패"}</p>
          <p className="mt-1">{status.message}</p>
          {status.type === "success" && status.inquiryId ? <p className="mt-2 text-xs opacity-70">접수 번호: {status.inquiryId}</p> : null}
        </div>
      ) : null}

      <div className="grid gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#15120d] transition hover:bg-[#f6e7cd] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "접수 중..." : "상담 신청 보내기"}
        </button>
        <p className="text-xs leading-6 text-white/52">
          접수 후 상담이 맞는지, 어디서 시작하면 좋을지 먼저 안내드립니다.
        </p>
      </div>
    </form>
  );
}
