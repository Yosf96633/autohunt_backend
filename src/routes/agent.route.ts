import { Router } from "express";
import { resumeAgent, runAgent } from "../controllers/agent.controller";
import { upload } from "../config/multer";

const router = Router();

router.post("/run", upload.single("cv"), runAgent);
router.post('/resume/:thread_id' , resumeAgent)

export default router;
