"use client";

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
  if (node.kind === "district") return 12;
  if (node.kind === "group") return 9;
  if (node.kind === "family") return 7;
  if (node.kind === "organization") return 6;
  return node.requiresFollowUp ? 6 : 4.5;
}

export default function ChurchForceGraph({ graph }: { graph: { nodes: GraphNode[]; edges: GraphEdge[] } }) {
  const ref = useRef<any>(null);
  const [selected, setSelected] = useState<GraphNode | null>(null);

  const data = useMemo(() => ({
    nodes: graph.nodes.map((node) => ({ ...node })),
    links: graph.edges.map((edge) => ({ ...edge })),
  }), [graph]);

  return (
    <div className="grid h-[820px] gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="overflow-hidden rounded-[24px] border border-[#1f2937] bg-[#020617]">
        <ForceGraph2D
          ref={ref}
          graphData={data}
          backgroundColor="#020617"
          linkColor={(link: any) => (link.kind === "organizationLink" ? "#f59e0b" : link.kind === "familyMember" ? "#2dd4bf" : "rgba(148,163,184,0.28)")}
          linkWidth={(link: any) => (link.kind === "groupMember" ? 1.5 : 1)}
          linkDirectionalParticles={(link: any) => (link.kind === "organizationLink" ? 2 : 0)}
          linkDirectionalParticleColor={() => "#f8fafc"}
          nodeRelSize={6}
          cooldownTicks={150}
          d3AlphaDecay={0.03}
          d3VelocityDecay={0.2}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.label as string;
            const color = nodeColor(node);
            const size = nodeSize(node);
            const fontSize = Math.max(10, 13 / globalScale);

            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
            ctx.fillStyle = color;
            ctx.fill();

            if (selected?.id === node.id) {
              ctx.beginPath();
              ctx.arc(node.x, node.y, size + 4, 0, 2 * Math.PI, false);
              ctx.strokeStyle = "rgba(250, 204, 21, 0.95)";
              ctx.lineWidth = 2;
              ctx.stroke();
            }

            ctx.font = `${fontSize}px Inter, sans-serif`;
            ctx.fillStyle = "rgba(248,250,252,0.9)";
            ctx.fillText(label, node.x + size + 4, node.y + 3);
          }}
          onNodeClick={(node: any) => {
            setSelected(node);
            if (ref.current) {
              ref.current.centerAt(node.x, node.y, 500);
              ref.current.zoom(2.2, 500);
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
          </div>
        ) : (
          <div className="grid gap-4">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">GRAPH DETAIL</p>
              <h3 className="mt-2 text-lg font-semibold text-[#111111]">{selected.label}</h3>
              <p className="mt-1 text-sm text-[#7b6f61]">{selected.kind}</p>
            </div>
            <div className="grid gap-2 text-sm">
              <div className="rounded-[14px] border border-[#efe7da] bg-[#fcfbf8] px-3 py-3"><span className="text-[11px] text-[#9a8b7a]">노드 유형</span><p className="mt-1 font-semibold">{selected.kind}</p></div>
              {selected.statusTag ? <div className="rounded-[14px] border border-[#efe7da] bg-[#fcfbf8] px-3 py-3"><span className="text-[11px] text-[#9a8b7a]">상태</span><p className="mt-1 font-semibold">{selected.statusTag}</p></div> : null}
              {selected.position ? <div className="rounded-[14px] border border-[#efe7da] bg-[#fcfbf8] px-3 py-3"><span className="text-[11px] text-[#9a8b7a]">직분</span><p className="mt-1 font-semibold">{selected.position}</p></div> : null}
              {selected.requiresFollowUp ? <div className="rounded-[14px] border border-[#f0d0d0] bg-[#fff0f0] px-3 py-3 text-[#a33d3d]"><span className="text-[11px]">후속관리 필요</span><p className="mt-1 font-semibold">바로 확인 대상</p></div> : null}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
