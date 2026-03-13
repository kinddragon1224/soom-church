import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { ZodError } from "zod";
import { applicationsRouter } from "./routes/applications";
import { formsRouter } from "./routes/forms";
import { healthRouter } from "./routes/health";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/health", healthRouter);
app.use("/forms", formsRouter);
app.use("/applications", applicationsRouter);

app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
  });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: error.issues.map((issue) => issue.message).join(", "),
      },
    });
    return;
  }

  if (error instanceof Error) {
    res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Unknown error",
    },
  });
});

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  console.log(`application-service listening on ${port}`);
});
