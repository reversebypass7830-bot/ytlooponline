import express, { type Express } from "express";
import cors from "cors";
import path from "node:path";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());
app.use(cors({ credentials: true, origin: true }));
if (process.env.CLERK_SECRET_KEY?.trim()) {
  app.use(
    clerkMiddleware((req) => ({
      publishableKey: publishableKeyFromHost(
        getClerkProxyHost(req) ?? "",
        process.env.CLERK_PUBLISHABLE_KEY,
      ),
    })),
  );
} else {
  logger.warn("Clerk is not configured; Firebase and mobile authentication remain enabled.");
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/api/owner/feedback/images",
  express.raw({
    type: ["image/jpeg", "image/png", "image/webp"],
    limit: "5mb",
  }),
);

app.use("/api", router);

const defaultFrontendDist = path.resolve(import.meta.dirname, "../../live/dist/public");
const frontendDist = process.env["FRONTEND_DIST"] ?? defaultFrontendDist;

app.use(express.static(frontendDist));
app.get(/^(?!\/api(?:\/|$)).*/, (_req, res, next) => {
  res.sendFile(path.join(frontendDist, "index.html"), (error) => {
    if (error) next(error);
  });
});

export default app;
