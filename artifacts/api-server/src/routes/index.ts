import { Router, type IRouter } from "express";
import healthRouter from "./health";
import streamingRouter from "./streaming";
import mediaRouter from "./media";
import ownerKeysRouter from "./ownerKeys";
import workspacesRouter from "./workspaces";
import accountsRouter from "./accounts";
import mobileAuthRouter from "./mobileAuth";
import firebaseAuthRouter from "./firebaseAuth";
import storageRouter from "./storage";
import feedbackRouter from "./feedback";

const router: IRouter = Router();

router.use(healthRouter);
router.use(streamingRouter);
router.use(mediaRouter);
router.use(ownerKeysRouter);
router.use(workspacesRouter);
router.use(accountsRouter);
router.use(mobileAuthRouter);
router.use(firebaseAuthRouter);
router.use(storageRouter);
router.use(feedbackRouter);

export default router;
