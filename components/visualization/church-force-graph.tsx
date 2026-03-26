"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ForceGraph2D } from "react-force-graph";

type GraphNode = {
  id: string;
  kind: string;
  label: string;
  statusTag?: string;
  requiresFollowUp?: boolean;
  position?: string | null;
  type?: string;
};

type GraphEdge = {
  id: string;
  source: string;
  target: string;
  kind: string;
};

function nodeColor(node: GraphNode) {
  if (node.kind === "district") return "#2563eb";
  if (node.kind === "group") return "#7c3aed";
  if (node.kind === "family") return "#0f766e";
  if (node.kind === "organization") return "#d97706";
  if (node.requiresFollowUp) return "#ef4444";
  if (node.statusTag === "심방필요") return "#f59e0b";
  if (node.statusTag === "새가족") return "#3b82f6";
  if (node.statusTag === "정착중") return "#22c55e";
  return "#94a3b8";
}

function nodeSize(node: GraphNode) {
  if (node.kind === "district") return 14;
  if (node.kind === "group") return 11;
  if (node.kind === "family") return 8;
  if (node.kind === "organization") return 7;
  return node.requiresFollowUp ? 7 : 5;
}

function kindLabel(kind: string) {
  if (kind === "district") return "교구";
  if (kind === "group") return "목장";
  if (kind === "family") return "가정";
  if (kind === "organization") return "부서/사역";
  return "개인";
}

export default function ChurchForceGraph({ graph, churchSlug }: { graph: { nodes: GraphNode[]; edges: GraphEdge[] }; churchSlug: string }) {
  const ref = useRef<any>(null);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const data = useMemo(
    () => ({
      nodes: graph.nodes.map((node) => ({ ...node, val: nodeSize(node) })),
      links: graph.edges.map((edge) => ({ ...edge })),
    }),
    [graph],
  );

  return (
    <div className="grid h-[860px] gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="overflow-hidden rounded-[24px] border border-[#1f2937] bg-[#020617]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-white/70">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">개인</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">가정</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">목장</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">교구</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">부서/사역</span>
          </div>
          <span className="text-white/45">군집 보기</span>
        </div>

        <ForceGraph2D
          ref={ref}
          graphData={data}
          backgroundColor="#020617"
          nodeRelSize={6}
          cooldownTicks={220}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.18}
          linkColor={(link: any) =>
            link.kind === "organizationLink"
              ? "rgba(245,158,11,0.72)"
              : link.kind === "familyMember"
                ? "rgba(45,212,191,0.52)"
                : link.kind === "groupMember"
                  ? "rgba(148,163,184,0.34)"
                  : "rgba(148,163,184,0.22)"
          }
          linkWidth={(link: any) => (link.kind === "groupMember" ? 1.7 : link.kind === "organizationLink" ? 1.4 : 1)}
          linkDirectionalParticles={(link: any) => (link.kind === "organizationLink" ? 2 : link.kind === "groupMember" ? 1 : 0)}
          linkDirectionalParticleWidth={(link: any) => (link.kind === "organizationLink" ? 2.2 : 1.2)}
          linkDirectionalParticleColor={(link: any) => (link.kind === "organizationLink" ? "#f8fafc" : "rgba(248,250,252,0.7)")}
          onNodeHover={(node: any) => setHoveredNodeId(node?.id ?? null)}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.label as string;
            const color = nodeColor(node);
            const size = nodeSize(node);
            const hovered = hoveredNodeId === node.id;
            const selectedNode = selected?.id === node.id;
            const fontSize = Math.max(9, 12 / globalScale);

            ctx.beginPath();
            ctx.arc(node.x, node.y, selectedNode ? size + 4 : hovered ? size + 2 : size, 0, 2 * Math.PI, false);
            ctx.fillStyle = color;
            ctx.fill();

            if (selectedNode) {
              ctx.beginPath();
              ctx.arc(node.x, node.y, size + 8, 0, 2 * Math.PI, false);
              ctx.strokeStyle = "rgba(250, 204, 21, 0.95)";
              ctx.lineWidth = 2;
              ctx.stroke();
            }

            if (node.requiresFollowUp) {
              ctx.beginPath();
              ctx.arc(node.x, node.y, size + 11, 0, 2 * Math.PI, false);
              ctx.strokeStyle = "rgba(239,68,68,0.35)";
              ctx.lineWidth = 2;
              ctx.stroke();
            }

            ctx.font = `${fontSize}px Inter, sans-serif`;
            ctx.fillStyle = hovered || selectedNode ? "rgba(255,255,255,0.98)" : "rgba(248,250,252,0.82)";
            ctx.fillText(label, node.x + size + 6, node.y + 3);
          }}
          onNodeClick={(node: any) => {
            setSelected(node);
            if (ref.current) {
              ref.current.centerAt(node.x, node.y, 500);
              ref.current.zoom(node.kind === "member" ? 3 : 2.2, 500);
            }
          }}
        />
      </div>

      <aside className="rounded-[24px] border border-[#e6dfd5] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        {!selected ? (
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">GRAPH DETAIL</p>
            <h3 className="mt-2 text-lg font-semibold text-[#111111]">노드를 선택해</h3>
            <p className="mt-3 text-sm leading-6 text-[#5f564b]">왼쪽 그래프에서 교인, 가족, 목장, 교구, 부서를 누르면 군집 중심으로 이동하고 상세가 뜬다.</p>
            <div className="mt-4 grid gap-2 text-sm text-[#5f564b]">
              <div className="rounded-[14px] border border-[#efe7da] bg-[#fcfbf8] px-3 py-3">빨강: 후속관리 필요</div>
              <div className="rounded-[14px] border border-[#efe7da] bg-[#fcfbf8] px-3 py-3">주황: 심방 필요</div>
              <div className="rounded-[14px] border border-[#efe7da] bg-[#fcfbf8] px-3 py-3">파랑: 새가족 / 교구</div>
              <div className="rounded-[14px] border border-[#efe7da] bg-[#fcfbf8] px-3 py-3">보라: 목장</div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">GRAPH DETAIL</p>
              <h3 className="mt-2 text-lg font-semibold text-[#111111]">{selected.label}</h3>
              <p className="mt-1 text-sm text-[#7b6f61]">{kindLabel(selected.kind)}</p>
            </div>
            <div className="grid gap-2 text-sm">
              <div className="rounded-[14px] border border-[#efe7da] bg-[#fcfbf8] px-3 py-3"><span className="text-[11px] text-[#9a8b7a]">노드 유형</span><p className="mt-1 font-semibold">{kindLabel(selected.kind)}</p></div>
              {selected.statusTag ? <div className="rounded-[14px] border border-[#efe7da] bg-[#fcfbf8] px-3 py-3"><span className="text-[11px] text-[#9a8b7a]">상태</span><p className="mt-1 font-semibold">{selected.statusTag}</p></div> : null}
              {selected.position ? <div className="rounded-[14px] border border-[#efe7da] bg-[#fcfbf8] px-3 py-3"><span className="text-[11px] text-[#9a8b7a]">직분</span><p className="mt-1 font-semibold">{selected.position}</p></div> : null}
              {selected.type ? <div className="rounded-[14px] border border-[#efe7da] bg-[#fcfbf8] px-3 py-3"><span className="text-[11px] text-[#9a8b7a]">부서 타입</span><p className="mt-1 font-semibold">{selected.type}</p></div> : null}
              {selected.requiresFollowUp ? <div className="rounded-[14px] border border-[#f0d0d0] bg-[#fff0f0] px-3 py-3 text-[#a33d3d]"><span className="text-[11px]">후속관리 필요</span><p className="mt-1 font-semibold">바로 확인 대상</p></div> : null}
              {selected.kind === "member" ? (
                <Link href={`/app/${churchSlug}/members/${selected.id.replace("member:", "")}`} className="rounded-[14px] bg-[#0f172a] px-3 py-3 text-center text-sm font-semibold text-white">
                  교인 상세 열기
                </Link>
              ) : null}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
