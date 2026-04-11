"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { BetaMember, readMemberByIdFromStorage } from "@/lib/beta-shepherding-client";

export default function BetaWorldShepherdingMemberPage() {
  const params = useParams<{ id: string }>();
  const [member, setMember] = useState<BetaMember | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    setMember(readMemberByIdFromStorage(params.id));
  }, [params]);

  return (
    <div className="-m-4 min-h-[calc(100vh-2rem)] overflow-hidden rounded-[30px] sm:-m-5 lg:-m-6">
      <div className="relative min-h-[calc(100vh-2rem)] bg-[linear-gradient(180deg,#f6efe3_0%,#efe2cf_100%)] p-5 lg:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/app/beta/world" className="rounded-full border border-[#e7dfd3] bg-white px-4 py-2 text-sm text-[#3f372d]">
            월드로
          </Link>
          <Link href="/app/beta/world/shepherding" className="rounded-full border border-[#e7dfd3] bg-white px-4 py-2 text-sm text-[#3f372d]">
            목양으로
          </Link>
        </div>

        {member ? (
          <div className="mt-5 grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
            <section className="rounded-[32px] border border-[#e5d8c7] bg-white/80 p-5 shadow-[0_18px_40px_rgba(66,38,12,0.08)] backdrop-blur-sm">
              <p className="text-[10px] tracking-[0.18em] text-[#9f8361]">목원 상세</p>
              <div className="mt-4 flex items-center gap-4">
                <div
                  className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] border border-[#eadfce] bg-[linear-gradient(180deg,#fff8ee_0%,#f4e7d4_100%)] text-2xl font-semibold text-[#5b4631]"
                  style={{ boxShadow: `inset 0 0 0 1px ${member.accent}44` }}
                >
                  {member.name.slice(0, 2)}
                </div>
                <div>
                  <p className="text-[1.6rem] font-semibold tracking-[-0.04em] text-[#2f2416]">{member.name}</p>
                  <p className="mt-1 text-sm text-[#7f6d59]">{member.status} · {member.relationship}</p>
                  <p className="mt-3 text-sm text-[#5f564b]">실제 얼굴 이미지와 큰 캐릭터가 들어올 자리</p>
                </div>
              </div>

              <div className="mt-5 rounded-[24px] border border-[#eadfce] bg-[linear-gradient(180deg,#fff8ee_0%,#f4e7d4_100%)] p-4">
                <p className="text-sm font-medium text-[#5b4631]">대표 캐릭터/얼굴 영역</p>
                <div className="mt-4 flex h-[260px] items-center justify-center rounded-[24px] border border-[#e2d2bd] bg-[#fcf7f0]">
                  <Image src="/beta-world/shepherding-room-bg-04.jpg" alt="placeholder" fill={false} width={220} height={220} className="hidden" />
                  <div className="flex h-40 w-40 items-center justify-center rounded-full border border-[#e2d2bd] bg-white text-[#8a7a69]">
                    얼굴/캐릭터
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 content-start">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-[#e5d8c7] bg-white/80 p-5 shadow-[0_18px_40px_rgba(66,38,12,0.08)]">성별: {member.gender}</div>
                <div className="rounded-[24px] border border-[#e5d8c7] bg-white/80 p-5 shadow-[0_18px_40px_rgba(66,38,12,0.08)]">나이: {member.age}</div>
                <div className="rounded-[24px] border border-[#e5d8c7] bg-white/80 p-5 shadow-[0_18px_40px_rgba(66,38,12,0.08)]">연락처: {member.phone}</div>
                <div className="rounded-[24px] border border-[#e5d8c7] bg-white/80 p-5 shadow-[0_18px_40px_rgba(66,38,12,0.08)]">침례: {member.baptized ? "유" : "무"}</div>
                <div className="rounded-[24px] border border-[#e5d8c7] bg-white/80 p-5 shadow-[0_18px_40px_rgba(66,38,12,0.08)]">직업: {member.job}</div>
                <div className="rounded-[24px] border border-[#e5d8c7] bg-white/80 p-5 shadow-[0_18px_40px_rgba(66,38,12,0.08)]">직분: {member.role}</div>
                <div className="rounded-[24px] border border-[#e5d8c7] bg-white/80 p-5 shadow-[0_18px_40px_rgba(66,38,12,0.08)]">교구: {member.district}</div>
                <div className="rounded-[24px] border border-[#e5d8c7] bg-white/80 p-5 shadow-[0_18px_40px_rgba(66,38,12,0.08)]">사역: {member.ministry}</div>
              </div>
              <div className="rounded-[24px] border border-[#e5d8c7] bg-white/80 p-5 shadow-[0_18px_40px_rgba(66,38,12,0.08)]">주소: {member.address}</div>
              <div className="rounded-[24px] border border-[#e5d8c7] bg-white/80 p-5 shadow-[0_18px_40px_rgba(66,38,12,0.08)]">관계: {member.relationship}</div>
              <div className="rounded-[24px] border border-[#e5d8c7] bg-white/80 p-5 shadow-[0_18px_40px_rgba(66,38,12,0.08)]">메모: {member.note}</div>
            </section>
          </div>
        ) : (
          <div className="mt-6 rounded-[24px] border border-[#e5d8c7] bg-white/80 p-6 text-[#5f564b] shadow-[0_18px_40px_rgba(66,38,12,0.08)]">
            목원 정보를 찾지 못했어.
          </div>
        )}
      </div>
    </div>
  );
}
