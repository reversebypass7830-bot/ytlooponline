import { Router, type IRouter } from "express";
import healthRouter from "./health";
import streamingRouter from "./streaming";
import mediaRouter from "./media";
import licensesRouter from "./licenses";
import accountsRouter from "./accounts";
import mobileAuthRouter from "./mobileAuth";
import firebaseAuthRouter from "./firebaseAuth";
import storageRouter from "./storage";
import feedbackRouter from "./feedback";

const router: IRouter = Router();

router.use(healthRouter);
router.use(streamingRouter);
router.use(mediaRouter);
router.use(licensesRouter);
router.use(accountsRouter);
router.use(mobileAuthRouter);
router.use(firebaseAuthRouter);
router.use(storageRouter);
router.use(feedbackRouter);

export default router;
