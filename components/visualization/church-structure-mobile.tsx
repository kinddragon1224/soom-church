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
  if (statusTag === "심방필요") return "border-[#f1d5b6] bg-[#fff1e5] text-[#a35a11]";
  if (statusTag === "후속필요") return "border-[#f0d0d0] bg-[#fff0f0] text-[#a33d3d]";
  if (statusTag === "새가족") return "border-[#c9dcf8] bg-[#e8f1ff] text-[#295fa8]";
  if (statusTag === "정착중") return "border-[#d5eacf] bg-[#eef8ea] text-[#2f6b2f]";
  return "border-[#e4dace] bg-[#f5f1ea] text-[#6d6255]";
}

export default function ChurchStructureMobile({ structure }: { structure: District[] }) {
  return (
    <div className="grid gap-4 lg:hidden">
      {structure.map((district) => (
        <section key={district.id} className="rounded-[20px] border border-[#e6dfd5] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="border-b border-[#efe7da] pb-3">
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">DISTRICT</p>
            <h3 className="mt-2 text-lg font-semibold text-[#111111]">{district.name}</h3>
          </div>

          <div className="mt-4 grid gap-3">
            {district.groups.map((group) => (
              <details key={group.id} className="rounded-[16px] border border-[#e7e0d4] bg-[#fcfbf8] p-3">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">{group.name}</p>
                      <p className="mt-1 text-xs text-[#8c7a5b]">가정 {group.familyCount} · 인원 {group.memberCount}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-[11px] text-[#8c7a5b]">
                      <span>후속 {group.followUpCount}</span>
                      <span>심방 {group.visitCount}</span>
                    </div>
                  </div>
                </summary>

                <div className="mt-3 grid gap-2 border-t border-[#efe7da] pt-3">
                  {group.families.map((family) => (
                    <div key={family.id} className="rounded-[14px] border border-[#efe7da] bg-white px-3 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-[#111111]">{family.name}</p>
                        <span className="text-[11px] text-[#8c7a5b]">{family.members.length}명</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {family.members.map((member) => (
                          <span key={member.id} className={`rounded-full border px-2.5 py-1 text-[11px] ${tone(member.statusTag)}`}>
                            {member.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
