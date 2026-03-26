"use client";

import "@xyflow/react/dist/style.css";
import { Background, Controls, MiniMap, ReactFlow, type Edge, type Node } from "@xyflow/react";

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

function color(node: GraphNode) {
  if (node.kind === "district") return "#1d4ed8";
  if (node.kind === "group") return "#7c3aed";
  if (node.kind === "family") return "#0f766e";
  if (node.kind === "organization") return "#b45309";
  if (node.requiresFollowUp) return "#dc2626";
  if (node.statusTag === "심방필요") return "#f59e0b";
  if (node.statusTag === "새가족") return "#2563eb";
  if (node.statusTag === "정착중") return "#16a34a";
  return "#64748b";
}

export default function ChurchGraphWorkspace({ graph }: { graph: { nodes: GraphNode[]; edges: GraphEdge[] } }) {
  const nodes: Node[] = graph.nodes.map((node, index) => {
    const lane = node.kind === "district" ? 0 : node.kind === "group" ? 1 : node.kind === "family" ? 2 : node.kind === "organization" ? 0 : 3;
    const x = 80 + lane * 280 + ((index % 3) * 18);
    const y = 60 + (index % 12) * 84;
    return {
      id: node.id,
      position: { x, y },
      data: { label: node.label },
      draggable: false,
      style: {
        background: color(node),
        color: "white",
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.12)",
        padding: "10px 14px",
        fontSize: 12,
        minWidth: node.kind === "member" ? 100 : 120,
        boxShadow: "0 10px 24px rgba(15,23,42,0.10)",
      },
    };
  });

  const edges: Edge[] = graph.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    animated: edge.kind === "organizationLink",
    style: {
      stroke: edge.kind === "familyMember" ? "#2dd4bf" : edge.kind === "organizationLink" ? "#f59e0b" : "#cbd5e1",
      strokeWidth: edge.kind === "groupMember" ? 1.5 : 1.2,
    },
  }));

  return (
    <div className="h-[780px] overflow-hidden rounded-[24px] border border-[#e6dfd5] bg-[#0f172a]">
      <ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }} nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}>
        <Background color="#243041" gap={20} />
        <MiniMap pannable zoomable nodeColor={(n) => String(n.style?.background ?? "#64748b")} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
