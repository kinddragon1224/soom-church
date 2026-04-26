import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getPlatformAdminSnapshot() {
  try {
    const [churchCount, subscriptionCount, activeUserCount] = await Promise.all([
      prisma.church.count({ where: { isActive: true } }),
      prisma.subscription.count(),
      prisma.user.count({ where: { isActive: true } }),
    ]);

    return { churchCount, subscriptionCount, activeUserCount, dbReady: true };
  } catch {
    return { churchCount: 0, subscriptionCount: 0, activeUserCount: 0, dbReady: false };
  }
}

export default async function PlatformAdminPage() {
  const snapshot = await getPlatformAdminSnapshot();

  const cards = [
    ["목장월드", snapshot.churchCount, "/platform-admin/churches", "Lab 공간 운영 상태"],
    ["플랜", snapshot.subscriptionCount, "/platform-admin/subscriptions", "실험 플랜과 상태"],
    ["사용자", snapshot.activeUserCount, "/platform-admin/users", "활성 사용자 현황"],
    ["상담 신청", "JSONL", "/platform-admin/inquiries", "커리어 상담 접수함"],
    ["블로그", "Notion", "/blog", "공개 블로그 연결 상태"],
  ] as const;

  return (
    <div className="space-y-4 text-[#111111]">
      <section className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-white/46">MOKJANG WORLD LAB ADMIN</p>
            <h1 className="mt-3 text-[2.2rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white">목장월드 Lab 운영 콘솔</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/66 sm:text-base">SOOM 커리어 컨설팅 웹과 분리된 목장월드 실험 공간, 사용자, 플랜 상태를 확인하는 관리자 전용 도구입니다.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/platform-admin/churches" className="rounded-[14px] border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white">Lab 공간 관리</Link>
            <Link href="/platform-admin/subscriptions" className="rounded-[14px] border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white">플랜 상태</Link>
            <Link href="/blog" className="rounded-[14px] border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white">블로그 보기</Link>
          </div>
        </div>
      </section>

      {!snapshot.dbReady ? (
        <section className="rounded-[24px] border border-[#f0d7d7] bg-[#fff8f7] p-5 text-[#7a3d35] shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <p className="text-[11px] tracking-[0.18em] text-[#b26d64]">CHECK</p>
          <h2 className="mt-2 text-lg font-semibold">운영 데이터를 아직 읽지 못하고 있습니다</h2>
          <p className="mt-3 text-sm leading-6">관리자 콘솔은 열렸지만 배포 DB 상태가 맞지 않아 상세 집계를 생략했습니다. 페이지는 중단되지 않도록 유지합니다.</p>
        </section>
      ) : null}

      <section className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, href, note]) => (
          <Link key={label} href={href} className="rounded-[20px] border border-[#e6dfd5] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition hover:border-[#d8c8af] hover:bg-[#fcfbf8]">
            <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#111111]">{value}</p>
            <p className="mt-2 text-xs text-[#8c7a5b]">{note}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
