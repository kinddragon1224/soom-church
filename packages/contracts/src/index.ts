import { z } from "zod";

export const applicationStatusValues = ["PENDING", "IN_REVIEW", "APPROVED", "REJECTED"] as const;
export const applicationStatusSchema = z.enum(applicationStatusValues);

export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;

export const applicationFormSchema = z.object({
  id: z.string(),
  churchId: z.string().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ApplicationFormDto = z.infer<typeof applicationFormSchema>;

export const applicationRecordSchema = z.object({
  id: z.string(),
  churchId: z.string().nullable(),
  formId: z.string(),
  formTitle: z.string(),
  applicantName: z.string(),
  applicantPhone: z.string().nullable(),
  payloadJson: z.string().nullable(),
  status: applicationStatusSchema,
  assignedToId: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ApplicationRecordDto = z.infer<typeof applicationRecordSchema>;

export const serviceHealthSchema = z.object({
  service: z.string(),
  status: z.literal("ok"),
  timestamp: z.string().datetime(),
});

export type ServiceHealthDto = z.infer<typeof serviceHealthSchema>;

export const listApplicationsQuerySchema = z.object({
  churchId: z.string().min(1).optional(),
  status: applicationStatusSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type ListApplicationsQuery = z.infer<typeof listApplicationsQuerySchema>;

export const listApplicationFormsQuerySchema = z.object({
  churchId: z.string().min(1).optional(),
  activeOnly: z
    .union([z.boolean(), z.literal("true"), z.literal("false")])
    .optional()
    .transform((value) => value === true || value === "true"),
});

export type ListApplicationFormsQuery = z.infer<typeof listApplicationFormsQuerySchema>;

export const createApplicationFormInputSchema = z.object({
  churchId: z.string().min(1).nullable().optional(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export type CreateApplicationFormInput = z.infer<typeof createApplicationFormInputSchema>;

export const createApplicationInputSchema = z.object({
  churchId: z.string().min(1).nullable().optional(),
  formId: z.string().min(1),
  applicantName: z.string().min(1),
  applicantPhone: z.string().nullable().optional(),
  payloadJson: z.string().nullable().optional(),
  assignedToId: z.string().nullable().optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationInputSchema>;

export const updateApplicationStatusInputSchema = z.object({
  status: applicationStatusSchema,
});

export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusInputSchema>;

export const applicationSummarySchema = z.object({
  pendingCount: z.number().int().nonnegative(),
  recentApplications: z.array(applicationRecordSchema),
});

export type ApplicationSummaryDto = z.infer<typeof applicationSummarySchema>;
