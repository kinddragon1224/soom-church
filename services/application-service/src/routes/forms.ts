import { Router } from "express";
import {
  createApplicationFormInputSchema,
  listApplicationFormsQuerySchema,
} from "@soom/contracts";
import { prisma } from "../lib/prisma";
import { toApplicationFormDto } from "../lib/serializers";

export const formsRouter = Router();

formsRouter.get("/", async (req, res, next) => {
  try {
    const query = listApplicationFormsQuerySchema.parse(req.query);
    const forms = await prisma.applicationForm.findMany({
      where: {
        ...(query.churchId ? { churchId: query.churchId } : {}),
        ...(query.activeOnly ? { isActive: true } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(forms.map(toApplicationFormDto));
  } catch (error) {
    next(error);
  }
});

formsRouter.post("/", async (req, res, next) => {
  try {
    const input = createApplicationFormInputSchema.parse(req.body);
    const form = await prisma.applicationForm.create({
      data: {
        churchId: input.churchId ?? null,
        title: input.title,
        description: input.description ?? null,
        isActive: input.isActive ?? true,
      },
    });

    res.status(201).json(toApplicationFormDto(form));
  } catch (error) {
    next(error);
  }
});
