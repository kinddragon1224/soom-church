import type { Application, ApplicationForm } from "@prisma/client";
import type { ApplicationFormDto, ApplicationRecordDto } from "@soom/contracts";

export function toApplicationFormDto(form: ApplicationForm): ApplicationFormDto {
  return {
    id: form.id,
    churchId: form.churchId,
    title: form.title,
    description: form.description,
    isActive: form.isActive,
    createdAt: form.createdAt.toISOString(),
    updatedAt: form.updatedAt.toISOString(),
  };
}

export function toApplicationRecordDto(
  application: Application & { form: Pick<ApplicationForm, "title"> },
): ApplicationRecordDto {
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
