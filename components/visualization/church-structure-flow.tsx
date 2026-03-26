"use client";

import { useMemo, useState } from "react";
import "@xyflow/react/dist/style.css";
import { Background, Controls, Handle, MiniMap, Position, ReactFlow, type Edge, type Node, type NodeMouseHandler } from "@xyflow/react";

type Member = { id: string; name: string; statusTag: string; requiresFollowUp: boolean; position: string | null };
type Family = { id: string; name: string; members: Member[] };
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
type District = { id: string; name: string; groups: Group[] };

type GroupNodeData = {
  kind: "group";
  districtName: string;
  group: Group;
  label: string;
  meta: string;
  alert: string;
};

type FamilyNodeData = {
  kind: "family";
  districtName: string;
  groupName: string;
  family: Family;
  label: string;
  members: Member[];
};

function tone(statusTag: string) {
  if (statusTag === "심방필요") return "#f59e0b";
  if (statusTag === "후속필요") return "#ef4444";
  if (statusTag === "새가족") return "#3b82f6";
  if (statusTag === "정착중") return "#22c55e";
  return "#94a3b8";
}

function badge(statusTag: string) {
  if (statusTag === "심방필요") return "border-[#f1d5b6] bg-[#fff1e5] text-[#a35a11]";
  if (statusTag === "후속필요") return "border-[#f0d0d0] bg-[#fff0f0] text-[#a33d3d]";
  if (statusTag === "새가족") return "border-[#c9dcf8] bg-[#e8f1ff] text-[#295fa8]";
  if (statusTag === "정착중") return "border-[#d5eacf] bg-[#eef8ea] text-[#2f6b2f]";
  return "border-[#e4dace] bg-[#f5f1ea] text-[#6d6255]";
}

function GroupNode({ data, selected }: { data: GroupNodeData; selected?: boolean }) {
  return (
    <div className={`min-w-[220px] rounded-[18px] border bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)] ${selected ? "border-[#c8a96b] ring-2 ring-[#efe0bb]" : "border-[#d8d2c8]"}`}>
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !bg-[#94a3b8]" />
      <p className="text-sm font-semibold text-[#111111]">{data.label}</p>
      <p className="mt-1 text-xs text-[#7b6f61]">{data.meta}</p>
      <div className="mt-3 inline-flex rounded-full border border-[#eadfcd] bg-[#fcfbf8] px-2.5 py-1 text-[11px] text-[#8c6a2e]">{data.alert}</div>
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !bg-[#94a3b8]" />
    </div>
  );
}

function FamilyNode({ data, selected }: { data: FamilyNodeData; selected?: boolean }) {
  return (
    <div className={`min-w-[240px] rounded-[18px] border bg-[#fcfbf8] px-4 py-3 shadow-[0_8px_18px_rgba(15,23,42,0.05)] ${selected ? "border-[#c8a96b] ring-2 ring-[#efe0bb]" : "border-[#e5ded2]"}`}>
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

const nodeTypes = { groupNode: GroupNode, familyNode: FamilyNode };

export default function ChurchStructureFlow({ structure }: { structure: District[] }) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const { nodes, edges, nodeLookup } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeLookup = new Map<string, GroupNodeData | FamilyNodeData>();

    structure.forEach((district, districtIndex) => {
      const districtX = 40 + districtIndex * 720;

      district.groups.forEach((group, groupIndex) => {
        const groupId = `group-${group.id}`;
        const groupY = 60 + groupIndex * 230;
        const groupData: GroupNodeData = {
          kind: "group",
          districtName: district.name,
          group,
          label: `${district.name} · ${group.name}`,
          meta: `가정 ${group.familyCount} · 인원 ${group.memberCount}`,
          alert: `후속 ${group.followUpCount} · 심방 ${group.visitCount} · 새가족 ${group.newCount}`,
        };
        nodeLookup.set(groupId, groupData);
        nodes.push({ id: groupId, type: "groupNode", position: { x: districtX, y: groupY }, data: groupData, draggable: false });

        group.families.slice(0, 4).forEach((family, familyIndex) => {
          const familyId = `family-${family.id}`;
          const familyData: FamilyNodeData = {
            kind: "family",
            districtName: district.name,
            groupName: group.name,
            family,
            label: family.name,
            members: family.members,
          };
          nodeLookup.set(familyId, familyData);
          nodes.push({ id: familyId, type: "familyNode", position: { x: districtX + 320, y: groupY + familyIndex * 86 }, data: familyData, draggable: false });
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

    return { nodes, edges, nodeLookup };
  }, [structure]);

  const selected = selectedNodeId ? nodeLookup.get(selectedNodeId) ?? null : null;
  const onNodeClick: NodeMouseHandler = (_, node) => setSelectedNodeId(node.id);

  return (
    <div className="grid h-[760px] w-full gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="overflow-hidden rounded-[24px] border border-[#e6dfd5] bg-[#f8f4ed]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
          onNodeClick={onNodeClick}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#e8e0d2" gap={18} />
          <MiniMap pannable zoomable nodeColor="#c8a96b" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      <aside className="rounded-[24px] border border-[#e6dfd5] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        {!selected ? (
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">DETAIL PANEL</p>
            <h3 className="mt-2 text-lg font-semibold text-[#111111]">목장이나 가정을 선택해</h3>
            <p className="mt-3 text-sm leading-6 text-[#5f564b]">왼쪽 노드 맵에서 목장 또는 가정을 누르면 구조 상세와 후속 대상이 여기 뜬다.</p>
          </div>
        ) : selected.kind === "group" ? (
          <div className="grid gap-4">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">GROUP DETAIL</p>
              <h3 className="mt-2 text-lg font-semibold text-[#111111]">{selected.group.name}</h3>
              <p className="mt-1 text-sm text-[#7b6f61]">{selected.districtName}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-[14px] border border-[#efe7da] bg-[#fcfbf8] px-3 py-3"><p className="text-[11px] text-[#9a8b7a]">가정</p><p className="mt-1 font-semibold">{selected.group.familyCount}</p></div>
              <div className="rounded-[14px] border border-[#efe7da] bg-[#fcfbf8] px-3 py-3"><p className="text-[11px] text-[#9a8b7a]">인원</p><p className="mt-1 font-semibold">{selected.group.memberCount}</p></div>
              <div className="rounded-[14px] border border-[#efe7da] bg-[#fcfbf8] px-3 py-3"><p className="text-[11px] text-[#9a8b7a]">후속</p><p className="mt-1 font-semibold">{selected.group.followUpCount}</p></div>
              <div className="rounded-[14px] border border-[#efe7da] bg-[#fcfbf8] px-3 py-3"><p className="text-[11px] text-[#9a8b7a]">심방</p><p className="mt-1 font-semibold">{selected.group.visitCount}</p></div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#8c7a5b]">가정 목록</p>
              <div className="mt-2 grid gap-2">
                {selected.group.families.map((family) => (
                  <div key={family.id} className="rounded-[14px] border border-[#efe7da] bg-[#fcfbf8] px-3 py-3">
                    <p className="text-sm font-medium text-[#111111]">{family.name}</p>
                    <p className="mt-1 text-xs text-[#7b6f61]">구성원 {family.members.length}명</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">FAMILY DETAIL</p>
              <h3 className="mt-2 text-lg font-semibold text-[#111111]">{selected.family.name}</h3>
              <p className="mt-1 text-sm text-[#7b6f61]">{selected.districtName} · {selected.groupName}</p>
            </div>
            <div className="grid gap-2">
              {selected.family.members.map((member) => (
                <div key={member.id} className="rounded-[14px] border border-[#efe7da] bg-[#fcfbf8] px-3 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-[#111111]">{member.name}</p>
                      <p className="mt-1 text-xs text-[#7b6f61]">{member.position ?? "직분 미정"}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] ${badge(member.statusTag)}`}>{member.statusTag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
