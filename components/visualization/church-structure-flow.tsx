"use client";

import "@xyflow/react/dist/style.css";
import { Background, Controls, Handle, MiniMap, Position, ReactFlow, type Edge, type Node } from "@xyflow/react";

type Family = {
  id: string;
  name: string;
  members: { id: string; name: string; statusTag: string; requiresFollowUp: boolean; position: string | null }[];
};

type Group = {
  id: string;
  name: string;
  memberCount: number;
  familyCount: number;
  followUpCount: number;
  visitCount: number;
  newCount: number;
  families: Family[];
};

type District = {
  id: string;
  name: string;
  groups: Group[];
};

function tone(statusTag: string) {
  if (statusTag === "심방필요") return "#f59e0b";
  if (statusTag === "후속필요") return "#ef4444";
  if (statusTag === "새가족") return "#3b82f6";
  if (statusTag === "정착중") return "#22c55e";
  return "#94a3b8";
}

function GroupNode({ data }: { data: { label: string; meta: string; alert: string } }) {
  return (
    <div className="min-w-[220px] rounded-[18px] border border-[#d8d2c8] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !bg-[#94a3b8]" />
      <p className="text-sm font-semibold text-[#111111]">{data.label}</p>
      <p className="mt-1 text-xs text-[#7b6f61]">{data.meta}</p>
      <div className="mt-3 inline-flex rounded-full border border-[#eadfcd] bg-[#fcfbf8] px-2.5 py-1 text-[11px] text-[#8c6a2e]">{data.alert}</div>
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !bg-[#94a3b8]" />
    </div>
  );
}

function FamilyNode({ data }: { data: { label: string; members: Family["members"] } }) {
  return (
    <div className="min-w-[240px] rounded-[18px] border border-[#e5ded2] bg-[#fcfbf8] px-4 py-3 shadow-[0_8px_18px_rgba(15,23,42,0.05)]">
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !bg-[#c0b4a2]" />
      <p className="text-sm font-semibold text-[#111111]">{data.label}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {data.members.map((member) => (
          <div
            key={member.id}
            className="rounded-full border px-2.5 py-1 text-[11px] text-white"
            style={{ backgroundColor: tone(member.statusTag), borderColor: tone(member.statusTag) }}
            title={`${member.name} · ${member.statusTag}`}
          >
            {member.name}
          </div>
        ))}
      </div>
    </div>
  );
}

const nodeTypes = {
  groupNode: GroupNode,
  familyNode: FamilyNode,
};

export default function ChurchStructureFlow({ structure }: { structure: District[] }) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  let xBase = 40;

  structure.forEach((district, districtIndex) => {
    const districtX = xBase + districtIndex * 720;

    district.groups.forEach((group, groupIndex) => {
      const groupId = `group-${group.id}`;
      const groupY = 60 + groupIndex * 230;

      nodes.push({
        id: groupId,
        type: "groupNode",
        position: { x: districtX, y: groupY },
        data: {
          label: `${district.name} · ${group.name}`,
          meta: `가정 ${group.familyCount} · 인원 ${group.memberCount}`,
          alert: `후속 ${group.followUpCount} · 심방 ${group.visitCount} · 새가족 ${group.newCount}`,
        },
        draggable: false,
      });

      group.families.slice(0, 4).forEach((family, familyIndex) => {
        const familyId = `family-${family.id}`;
        nodes.push({
          id: familyId,
          type: "familyNode",
          position: { x: districtX + 320, y: groupY + familyIndex * 86 },
          data: { label: family.name, members: family.members },
          draggable: false,
        });
        edges.push({
          id: `edge-${groupId}-${familyId}`,
          source: groupId,
          target: familyId,
          animated: family.members.some((member) => member.requiresFollowUp),
          style: { stroke: "#c8b79c", strokeWidth: 1.5 },
        });
      });
    });
  });

  return (
    <div className="h-[760px] w-full overflow-hidden rounded-[24px] border border-[#e6dfd5] bg-[#f8f4ed]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e8e0d2" gap={18} />
        <MiniMap pannable zoomable nodeColor="#c8a96b" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
