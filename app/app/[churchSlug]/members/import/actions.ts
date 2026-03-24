"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { Gender } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceMembership } from "@/lib/church-context";

function parseCsvLine(line: string) {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
}

function parseCsv(text: string) {
  const normalized = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalized.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] as Record<string, string>[] };

  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index] ?? "";
      return acc;
    }, {});
  });

  return { headers, rows };
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/\s+/g, "").replace(/[_-]/g, "");
}

function getValue(row: Record<string, string>, aliases: string[]) {
  const entry = Object.entries(row).find(([key]) => aliases.includes(normalizeKey(key)));
  return entry?.[1]?.trim() ?? "";
}

function inferGender(value: string) {
  const normalized = value.trim().toLowerCase();
  if (["남", "남성", "male", "m"].includes(normalized)) return Gender.MALE;
  if (["여", "여성", "female", "f"].includes(normalized)) return Gender.FEMALE;
  return Gender.OTHER;
}

function parseBirthDate(value: string) {
  if (!value.trim()) return new Date("1990-01-01");
  const normalized = value.replace(/\./g, "-").replace(/\//g, "-");
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? new Date("1990-01-01") : parsed;
}

function parseRegisteredAt(value: string) {
  if (!value.trim()) return new Date();
  const normalized = value.replace(/\./g, "-").replace(/\//g, "-");
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function inferStatusTag(value: string) {
  return value.trim() || "등록대기";
}

async function refreshMembers(churchId: string) {
  revalidateTag(`church:${churchId}:members`);
  revalidateTag(`church:${churchId}:dashboard`);
}

export async function importMembersCsv(churchSlug: string, formData: FormData) {
  const { membership, userId } = await requireWorkspaceMembership(churchSlug);
  if (!membership) return;

  const file = formData.get("csvFile");
  if (!(file instanceof File)) return;

  const raw = await file.text();
  const { rows } = parseCsv(raw);
  if (!rows.length) return;

  const churchId = membership.church.id;
  const districts = await prisma.district.findMany({ where: { churchId } });
  const groups = await prisma.group.findMany({ where: { churchId } });
  const households = await prisma.household.findMany({ where: { churchId } });

  const districtMap = new Map(districts.map((item) => [item.name.trim(), item]));
  const householdMap = new Map(households.map((item) => [item.name.trim(), item]));
  const groupMap = new Map(groups.map((item) => [`${item.districtId}:${item.name.trim()}`, item]));

  let importedCount = 0;

  for (const row of rows) {
    const name = getValue(row, ["name", "이름", "성명"]);
    const phone = getValue(row, ["phone", "전화번호", "휴대폰", "연락처"]);
    if (!name || !phone) continue;

    const districtName = getValue(row, ["district", "교구"]);
    const groupName = getValue(row, ["group", "목장"]);
    const householdName = getValue(row, ["household", "family", "가족", "가정"]);

    let householdId: string | null = null;
    if (householdName) {
      const existingHousehold = householdMap.get(householdName);
      if (existingHousehold) {
        householdId = existingHousehold.id;
      } else {
        const created = await prisma.household.create({ data: { churchId, name: householdName } });
        householdMap.set(householdName, created);
        householdId = created.id;
      }
    }

    let districtId: string | null = null;
    if (districtName) {
      const existingDistrict = districtMap.get(districtName);
      if (existingDistrict) {
        districtId = existingDistrict.id;
      } else {
        const created = await prisma.district.create({ data: { churchId, name: districtName } });
        districtMap.set(districtName, created);
        districtId = created.id;
      }
    }

    let groupId: string | null = null;
    if (districtId && groupName) {
      const groupKey = `${districtId}:${groupName}`;
      const existingGroup = groupMap.get(groupKey);
      if (existingGroup) {
        groupId = existingGroup.id;
      } else {
        const created = await prisma.group.create({ data: { churchId, districtId, name: groupName } });
        groupMap.set(groupKey, created);
        groupId = created.id;
      }
    }

    const existingMember = await prisma.member.findFirst({
      where: { churchId, name, phone, isDeleted: false },
      select: { id: true },
    });
    if (existingMember) continue;

    const created = await prisma.member.create({
      data: {
        churchId,
        name,
        gender: inferGender(getValue(row, ["gender", "성별"])),
        birthDate: parseBirthDate(getValue(row, ["birthdate", "생년월일", "birth"])),
        phone,
        email: getValue(row, ["email", "이메일"]) || null,
        address: getValue(row, ["address", "주소"]) || null,
        householdId,
        districtId,
        groupId,
        registeredAt: parseRegisteredAt(getValue(row, ["registeredat", "등록일"])),
        position: getValue(row, ["position", "직분"]) || null,
        statusTag: inferStatusTag(getValue(row, ["status", "상태", "상태태그"])),
        requiresFollowUp: ["1", "true", "yes", "y", "필요"].includes(getValue(row, ["requiresfollowup", "후속관리", "followup"]).toLowerCase()),
        notes: getValue(row, ["notes", "메모"]) || null,
        currentJob: getValue(row, ["job", "currentjob", "직업"]) || null,
        previousChurch: getValue(row, ["previouschurch", "이전교회"]) || null,
        previousFaith: getValue(row, ["previousfaith", "이전신앙"]) || null,
        baptismStatus: getValue(row, ["baptism", "baptismstatus", "침례", "세례"]) || null,
      },
    });

    await prisma.activityLog.create({
      data: {
        churchId,
        actorId: userId,
        action: "MEMBER_IMPORTED_FROM_CSV",
        targetType: "Member",
        targetId: created.id,
        memberId: created.id,
      },
    });

    importedCount += 1;
  }

  await refreshMembers(churchId);
  redirect(`/app/${churchSlug}/members/import?done=${importedCount}`);
}
