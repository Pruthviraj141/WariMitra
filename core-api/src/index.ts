import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { initSocketIO } from "./config/socket";
import { logger } from "./utils/logger";
import { requestLogger, requestId } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";

const app = express();
const httpServer = createServer(app);

initSocketIO(httpServer);

// Trust proxy is required if running behind Nginx/load balancer
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { status: 'error', message: 'Too many requests, please try again later.' }
});

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(requestId);
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/api/v1", routes);

app.use(errorHandler);

async function start(): Promise<void> {
  await connectDatabase();

  httpServer.listen(env.PORT, () => {
    logger.info(`Core API running on port ${env.PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
  });
}

start().catch((error) => {
  logger.error({ err: error }, "Failed to start server");
  process.exit(1);
});
