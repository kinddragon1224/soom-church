"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const resultLabels = {
  tool_operator: "도구 운용자",
  result_maker: "결과 제작자",
  context_interpreter: "맥락 해석자",
  problem_finder: "문제 발견자",
  relationship_coordinator: "관계 조율자",
} as const;

const trackLabels = {
  student_parent: {
    label: "학생/부모",
    title: "우리 아이 5포지션 리포트",
    stage: "학생/부모",
    situation: "아이 학년/나이, 좋아하는 과목과 싫어하는 과목, AI 시대 진로에서 부모가 가장 걱정하는 장면을 적어주세요.",
    strengths: "아이의 성향, 활동, 반복해서 잘하는 것, 오래 몰입하는 것, 사람/도구/결과물 중 어디에서 힘이 보이는지 적어주세요.",
  },
  early_career: {
    label: "20대/첫 커리어",
    title: "첫 커리어 포지션 리포트",
    stage: "20대 커리어",
    situation: "전공, 현재 상태, 지원하거나 고민 중인 직무, 가장 막힌 지점을 적어주세요.",
    strengths: "프로젝트, 아르바이트, 인턴, 동아리, 수업 과제, AI 활용 경험, 만든 결과물이나 문제를 찾은 경험을 적어주세요.",
  },
  transition: {
    label: "40~50대/전환",
    title: "경력 포지션 재설계 리포트",
    stage: "40~50대 후반전 커리어",
    situation: "해온 일, 전환을 고민하게 된 이유, 생계/시간/지역 등 현실 조건을 적어주세요.",
    strengths: "오래 맡아온 역할, 반복해서 해결한 문제, 자격·기술·관계 자산, AI 이후에도 남을 일의 면을 적어주세요.",
  },
} as const;

type ResultType = keyof typeof resultLabels;
type TrackType = keyof typeof trackLabels;
type TargetType = "child" | "self" | "transition";
type Status = { type: "idle" } | { type: "success"; message: string; requestId?: string } | { type: "error"; message: string };

const fieldClass = "min-h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none placeholder:text-white/32 focus:border-[#ff6b35]/55";
const areaClass = "min-h-[140px] w-full rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 text-white outline-none placeholder:text-white/32 focus:border-[#ff6b35]/55";

const nextStepCards = [
  {
    title: "1. 내용 확인",
    desc: "남겨주신 상황, 원하는 결과, 피하고 싶은 방향을 먼저 읽습니다.",
  },
  {
    title: "2. 상품 경로 안내",
    desc: "미니 리포트로 충분한지, 상세 리포트가 맞는지 먼저 안내드립니다.",
  },
  {
    title: "3. 필요 시 1:1 연결",
    desc: "복잡한 선택이 남는 경우에만 프리미엄 미래설계 상담을 제안합니다.",
  },
] as const;

const targetOptions: { value: TargetType; label: string; desc: string }[] = [
  { value: "child", label: "자녀", desc: "아이의 과목, 활동, 부모의 불안을 함께 봅니다." },
  { value: "self", label: "본인", desc: "전공, 경험, 첫 커리어의 역할 위치를 봅니다." },
  { value: "transition", label: "경력 전환", desc: "기존 경력을 버리지 않고 남는 면을 봅니다." },
];

export function ReportIntakeForm() {
  const searchParams = useSearchParams();
  const rawType = searchParams.get("type") ?? "";
  const rawTrack = searchParams.get("track") ?? "";
  const diagnosisType = rawType in resultLabels ? (rawType as ResultType) : null;
  const trackType: TrackType = rawTrack in trackLabels ? (rawTrack as TrackType) : "early_career";
  const track = trackLabels[trackType];
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focus, setFocus] = useState("AI 시대 진로 포지션");
  const [stage, setStage] = useState<string>(track?.stage ?? "");
  const [targetType, setTargetType] = useState<TargetType>(
    trackType === "student_parent" ? "child" : trackType === "transition" ? "transition" : "self",
  );

  useEffect(() => {
    if (!diagnosisType) return;
    if (diagnosisType === "tool_operator") setFocus("도구를 쓰는 데서 끝나지 않고 판단을 키우는 방법");
    else if (diagnosisType === "result_maker") setFocus("결과물을 만들고 포지션으로 보여주는 방법");
    else if (diagnosisType === "context_interpreter") setFocus("AI 결과를 사람 말로 바꾸는 힘");
    else if (diagnosisType === "problem_finder") setFocus("AI가 풀 문제를 찾는 힘");
    else setFocus("사람 사이의 신뢰와 관계를 다루는 힘");
  }, [diagnosisType]);

  useEffect(() => {
    if (track?.stage) setStage(track.stage);
  }, [track]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "idle" });
    setIsSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const currentAnxiety = String(formData.get("currentAnxiety") ?? "").trim();
    const avoidFuture = String(formData.get("avoidFuture") ?? "").trim();
    const triedActivities = String(formData.get("triedActivities") ?? "").trim();
    const payload = {
      source: searchParams.get("source") ?? "diagnosis-report-intake",
      diagnosisResultType: diagnosisType ?? "",
      track: trackType,
      name: String(formData.get("name") ?? "").trim(),
      contact: String(formData.get("contact") ?? "").trim(),
      stage,
      focus,
      targetType,
      childGradeOrAge: String(formData.get("childGradeOrAge") ?? "").trim(),
      currentAnxiety,
      avoidFuture,
      triedActivities,
      currentSituation: currentAnxiety,
      wantedOutcome: String(formData.get("wantedOutcome") ?? "").trim(),
      strengths: triedActivities,
      avoidPath: avoidFuture,
      referenceUrl: String(formData.get("referenceUrl") ?? "").trim(),
      companyWebsite: String(formData.get("companyWebsite") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/diagnosis/report-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "상세 리포트 요청을 접수하지 못했습니다.");
      form.reset();
      setStatus({
        type: "success",
        message:
          data?.message ||
          "5포지션 리포트 베타 요청이 접수되었습니다. 내용을 확인한 뒤 미니/상세 리포트 안내를 먼저 드리고, 복잡한 선택이 남는 경우에만 프리미엄 1:1 미래설계 상담 연결 가능 여부를 안내드릴게요.",
        requestId: data?.requestId,
      });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "상세 리포트 요청을 접수하지 못했습니다." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    status.type === "success" ? (
      <div className="grid gap-5">
        <div className="rounded-[28px] border border-[#73d6b6]/30 bg-[#73d6b6]/10 px-5 py-6 text-white sm:px-6">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#baf7d7]">Request Received</p>
          <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] sm:text-3xl">5포지션 리포트 요청이 접수되었습니다.</h2>
          <p className="mt-4 text-sm font-bold leading-7 text-white/72">{status.message}</p>
          {status.requestId ? (
            <div className="mt-5 rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm leading-7 text-white/78">
              <p className="font-black text-white">접수 번호</p>
              <p className="mt-1 font-mono text-[#baf7d7]">{status.requestId}</p>
            </div>
          ) : null}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.045] px-5 py-5 sm:px-6">
          <p className="text-sm font-black text-white">다음 안내는 이렇게 진행됩니다</p>
          <div className="mt-4 grid gap-3">
            {nextStepCards.map((item) => (
              <div key={item.title} className="rounded-[22px] border border-white/10 bg-black/16 px-4 py-4 text-sm leading-7 text-white/70">
                <p className="font-black text-white">{item.title}</p>
                <p className="mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white/70">
            <p className="font-black text-white">미니 리포트 베타</p>
            <p className="mt-2 text-xl font-black text-white">29,000원</p>
            <p className="mt-2">한 줄 진단, 핵심 막힘, 다음 행동 3개를 짧게 정리합니다.</p>
          </div>
          <div className="rounded-[24px] border border-[#ff6b35]/25 bg-[#ff6b35]/10 px-4 py-4 text-sm leading-7 text-white/74">
            <p className="font-black text-white">상세 리포트 베타</p>
            <p className="mt-2 text-xl font-black text-white">59,000원</p>
            <p className="mt-2">개인 조건, 피해야 할 착각, 방향 후보, 7/14일 실행안을 정리합니다.</p>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/18 px-4 py-4 text-xs leading-6 text-white/52">
          결제는 아직 자동으로 진행하지 않습니다. 베타 단계에서는 요청 내용을 확인한 뒤 맞는 리포트 범위와 가격을 수동으로 안내드립니다.
        </div>

        <button
          type="button"
          onClick={() => setStatus({ type: "idle" })}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-6 text-sm font-black text-white transition hover:border-white/30 hover:bg-white/10"
        >
          다른 요청 다시 남기기
        </button>
      </div>
    ) : (
    <form onSubmit={handleSubmit} className="grid gap-7">
      {diagnosisType ? (
        <div className="rounded-[24px] border border-[#ff6b35]/25 bg-[#ff6b35]/10 px-4 py-4 text-sm leading-7 text-white/76">
          <p className="font-black text-white">포지션 결과 기반 시작: {resultLabels[diagnosisType]}</p>
          <p className="mt-1">방금 본 무료 체크를 바탕으로, 개인 상황을 더 받아 5포지션 리포트 요청으로 연결합니다.</p>
        </div>
      ) : null}

      <div className="rounded-[24px] border border-white/10 bg-white/[0.045] px-4 py-4 text-sm leading-7 text-white/76">
        <p className="font-black text-white">선택한 리포트: {track.title}</p>
        <p className="mt-1">아래 입력을 바탕으로 무료 결과를 내 상황 기준의 미니/상세 5포지션 리포트로 확장합니다.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-white/78">
          <span className="font-bold text-white">이름</span>
          <input name="name" className={fieldClass} placeholder="성함 또는 닉네임" required />
        </label>
        <label className="grid gap-2 text-sm text-white/78">
          <span className="font-bold text-white">연락처</span>
          <input name="contact" className={fieldClass} placeholder="이메일 / 전화번호 / 카카오톡 ID" required />
        </label>
      </div>

      <div className="grid gap-3">
        <p className="text-sm font-bold text-white">대상 구분</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {targetOptions.map((option) => {
            const active = targetType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setTargetType(option.value)}
                className={`rounded-[20px] border px-4 py-4 text-left transition ${
                  active
                    ? "border-[#ff6b35]/70 bg-[#ff6b35]/14 text-white"
                    : "border-white/10 bg-white/[0.035] text-white/66 hover:border-[#ff6b35]/35 hover:bg-[#ff6b35]/8"
                }`}
              >
                <span className="text-sm font-black">{option.label}</span>
                <span className="mt-2 block text-xs font-bold leading-5 text-white/56">{option.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-white/78">
          <span className="font-bold text-white">현재 상태</span>
          <select name="stage" className={fieldClass} value={stage} onChange={(e) => setStage(e.target.value)} required>
            <option value="" disabled>선택해 주세요</option>
            <option>학생/부모</option>
            <option>20대 커리어</option>
            <option>재직 중</option>
            <option>전환 준비</option>
            <option>40~50대 후반전 커리어</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm text-white/78">
          <span className="font-bold text-white">이번 리포트에서 가장 보고 싶은 것</span>
          <input value={focus} onChange={(e) => setFocus(e.target.value)} className={fieldClass} />
        </label>
      </div>

      {targetType === "child" ? (
        <label className="grid gap-2 text-sm text-white/78">
          <span className="font-bold text-white">자녀 학년 또는 나이</span>
          <input name="childGradeOrAge" className={fieldClass} placeholder="예: 중2, 고1, 17세" />
        </label>
      ) : null}

      <label className="grid gap-2 text-sm text-white/78">
        <span className="font-bold text-white">현재 가장 불안한 것</span>
        <textarea name="currentAnxiety" className={areaClass} placeholder="직업 이름, 과목 선택, 첫 직무, 경력 전환 중 지금 제일 불안한 장면을 적어주세요." required minLength={10} />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-white/78">
          <span className="font-bold text-white">피하고 싶은 미래</span>
          <textarea name="avoidFuture" className={areaClass} placeholder="절대 가고 싶지 않은 방향, 반복하고 싶지 않은 선택, 피하고 싶은 상태" required minLength={10} />
        </label>
        <label className="grid gap-2 text-sm text-white/78">
          <span className="font-bold text-white">지금까지 해본 활동</span>
          <textarea name="triedActivities" className={areaClass} placeholder={track?.strengths ?? "전공, 경력, 해본 일, 성향, 반복적으로 맡아온 역할 등"} required minLength={10} />
        </label>
      </div>

      <label className="grid gap-2 text-sm text-white/78">
        <span className="font-bold text-white">원하는 결과</span>
        <textarea name="wantedOutcome" className={areaClass} placeholder="이번 리포트로 얻고 싶은 판단이나 결론. 예: 아이에게 맞는 활동 순서, 첫 직무 방향, 전환 가능성 비교" required minLength={10} />
      </label>

      <div className="grid gap-5">
        <label className="grid gap-2 text-sm text-white/78">
          <span className="font-bold text-white">참고 자료</span>
          <input name="referenceUrl" className={fieldClass} placeholder="이력서, 생기부, 포트폴리오, 노션, SNS 링크 등" />
        </label>
      </div>

      <input name="companyWebsite" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white/70">
        <p className="font-bold text-white">상세 리포트에서 남길 것</p>
        <ul className="mt-3 grid gap-2">
          <li>현재 가까운 5포지션</li>
          <li>대체면과 잔존면</li>
          <li>먼저 키울 역할 위치 2~3개</li>
          <li>다음 7일/14일 행동 3개</li>
        </ul>
        <p className="mt-4 text-xs leading-6 text-white/48">입력한 내용은 진단/리포트 답변 준비에만 사용합니다.</p>
      </div>

      {status.type === "error" ? (
        <div className="rounded-[22px] border border-[#f3a6a6]/30 bg-[#fff0f0]/10 px-4 py-4 text-sm leading-6 text-[#ffd6d6]">
          <p className="font-bold">접수 실패</p>
          <p className="mt-1">{status.message}</p>
        </div>
      ) : null}

      <div className="grid gap-3">
        <button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-[#080b12] transition hover:bg-[#ff6b35] hover:text-white disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? "접수 중..." : "5포지션 리포트 요청 보내기"}
        </button>
        <p className="text-xs leading-6 text-white/52">지금은 결제 전 MVP 단계라 베타 요청을 먼저 수집합니다. 미니 리포트는 29,000원, 상세 리포트는 59,000원 가격 가설이며 결제는 아직 진행하지 않습니다.</p>
      </div>
    </form>
    )
  );
}
