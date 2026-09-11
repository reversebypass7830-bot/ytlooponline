import { Router, type IRouter } from "express";
import healthRouter from "./health";
import streamingRouter from "./streaming";
import mediaRouter from "./media";
import licensesRouter from "./licenses";
import accountsRouter from "./accounts";

const router: IRouter = Router();

router.use(healthRouter);
router.use(streamingRouter);
router.use(mediaRouter);
router.use(licensesRouter);
router.use(accountsRouter);

export default router;
