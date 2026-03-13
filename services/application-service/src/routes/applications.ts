import { Router } from "express";
import {
  createApplicationInputSchema,
  listApplicationsQuerySchema,
  updateApplicationStatusInputSchema,
} from "@soom/contracts";
import { prisma } from "../lib/prisma";
import { toApplicationRecordDto } from "../lib/serializers";

export const applicationsRouter = Router();

applicationsRouter.get("/", async (req, res, next) => {
  try {
    const query = listApplicationsQuerySchema.parse(req.query);
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

    res.json(applications.map(toApplicationRecordDto));
  } catch (error) {
    next(error);
  }
});

applicationsRouter.get("/summary", async (req, res, next) => {
  try {
    const query = listApplicationsQuerySchema.parse(req.query);
    const [pendingCount, recentApplications] = await Promise.all([
      prisma.application.count({
        where: {
          ...(query.churchId ? { churchId: query.churchId } : {}),
          status: "PENDING",
        },
      }),
      prisma.application.findMany({
        where: {
          ...(query.churchId ? { churchId: query.churchId } : {}),
        },
        include: {
          form: {
            select: {
              title: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: Math.min(query.limit, 10),
      }),
    ]);

    res.json({
      pendingCount,
      recentApplications: recentApplications.map(toApplicationRecordDto),
    });
  } catch (error) {
    next(error);
  }
});

applicationsRouter.post("/", async (req, res, next) => {
  try {
    const input = createApplicationInputSchema.parse(req.body);
    const application = await prisma.application.create({
      data: {
        churchId: input.churchId ?? null,
        formId: input.formId,
        applicantName: input.applicantName,
        applicantPhone: input.applicantPhone ?? null,
        payloadJson: input.payloadJson ?? null,
        assignedToId: input.assignedToId ?? null,
      },
      include: {
        form: {
          select: {
            title: true,
          },
        },
      },
    });

    res.status(201).json(toApplicationRecordDto(application));
  } catch (error) {
    next(error);
  }
});

applicationsRouter.patch("/:id/status", async (req, res, next) => {
  try {
    const input = updateApplicationStatusInputSchema.parse(req.body);
    const application = await prisma.application.update({
      where: { id: req.params.id },
      data: {
        status: input.status,
      },
      include: {
        form: {
          select: {
            title: true,
          },
        },
      },
    });

    res.json(toApplicationRecordDto(application));
  } catch (error) {
    next(error);
  }
});
