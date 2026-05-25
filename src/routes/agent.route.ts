import { Router } from "express";
import { runAgent } from "../controllers/agent.controller";
import { upload } from "../config/multer";

const router = Router();

router.post("/run", upload.single("cv"), runAgent);

export default router;
