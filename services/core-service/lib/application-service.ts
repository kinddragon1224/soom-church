import type { ApplicationStatus } from "@soom/contracts";
import type { ApplicationRecordDto, ApplicationSummaryDto, ListApplicationsQuery } from "@soom/contracts";
import { requestJson } from "@soom/service-client";
import { prisma } from "./prisma";

const defaultApplicationServiceUrl = "http://localhost:3004";

function getApplicationServiceBaseUrl() {
  return (process.env.APPLICATION_SERVICE_URL ?? defaultApplicationServiceUrl).replace(/\/$/, "");
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

function mapLocalApplicationRecord(application: {
  id: string;
  churchId: string | null;
  formId: string;
  applicantName: string;
  applicantPhone: string | null;
  payloadJson: string | null;
  status: ApplicationStatus;
  assignedToId: string | null;
  createdAt: Date;
  updatedAt: Date;
  form: { title: string };
}): ApplicationRecordDto {
  return {
    id: application.id,
    churchId: application.churchId,
    formId: application.formId,
    formTitle: application.form.title,
    applicantName: application.applicantName,
    applicantPhone: application.applicantPhone,
    payloadJson: application.payloadJson,
    status: application.status,
    assignedToId: application.assignedToId,
    createdAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
  };
}

async function listApplicationsFromLocal(query: ListApplicationsQuery): Promise<ApplicationRecordDto[]> {
  const applications = await prisma.application.findMany({
    where: {
      ...(query.churchId ? { churchId: query.churchId } : {}),
      ...(query.status ? { status: query.status } : {}),
    },
    include: {
      form: {
        select: {
          title: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: query.limit,
  });

  return applications.map(mapLocalApplicationRecord);
}

async function getApplicationSummaryFromLocal(churchId?: string, limit = 5): Promise<ApplicationSummaryDto> {
  const [pendingCount, recentApplications] = await Promise.all([
    prisma.application.count({
      where: {
        ...(churchId ? { churchId } : {}),
        status: "PENDING",
      },
    }),
    prisma.application.findMany({
      where: churchId ? { churchId } : undefined,
      include: {
        form: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
  ]);

  return {
    pendingCount,
    recentApplications: recentApplications.map(mapLocalApplicationRecord),
  };
}

export async function listApplications(query: ListApplicationsQuery): Promise<ApplicationRecordDto[]> {
  const url = `${getApplicationServiceBaseUrl()}/applications${buildQuery({
    churchId: query.churchId,
    status: query.status,
    limit: query.limit,
  })}`;

  try {
    return await requestJson<ApplicationRecordDto[]>(url, {
      cache: "no-store",
      timeoutMs: 3_000,
    });
  } catch {
    return listApplicationsFromLocal(query);
  }
}

export async function getApplicationSummary(churchId?: string, limit = 5): Promise<ApplicationSummaryDto> {
  const url = `${getApplicationServiceBaseUrl()}/applications/summary${buildQuery({
    churchId,
    limit,
  })}`;

  try {
    return await requestJson<ApplicationSummaryDto>(url, {
      cache: "no-store",
      timeoutMs: 3_000,
    });
  } catch {
    return getApplicationSummaryFromLocal(churchId, limit);
  }
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  const url = `${getApplicationServiceBaseUrl()}/applications/${id}/status`;

  try {
    return await requestJson<ApplicationRecordDto>(url, {
      method: "PATCH",
      body: { status },
      cache: "no-store",
      timeoutMs: 3_000,
    });
  } catch {
    const application = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        form: {
          select: {
            title: true,
          },
        },
      },
    });

    return mapLocalApplicationRecord(application);
  }
}
