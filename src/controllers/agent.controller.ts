import type { Request, Response } from "express";
import { graph } from "../graph/graph";

export async function runAgent(req: Request, res: Response) {
  try {
    // 1 — check CV file exists
    if (!req.file) {
      res.status(400).json({ error: "CV file is required" });
      return;
    }

    // 2 — parse preferences from form body
    const preferences = JSON.parse(req.body.preferences);
    console.log("Preferences : " , preferences)
    console.log("Thread ID : " , req.body.thread_id)

    // 3 — generate unique run id (used as thread_id for checkpointer)
    const runId = req.body.thread_id as string
   const mock = req.body.mock === "true" || req.body.mock === true

    // 4 — invoke graph
    const result = await graph.invoke(
      {
        cvBuffer: req.file.buffer,
        preferences,
        parsedCV: null,
        rawJobs: [],
        scoredJobs: [],
        mock,
        filteredJobs: [],
        coverLetters: {},
        applications: [],
        digest: "",
        status: "parsing_cv",
        runId,
        error: null,
      },
      {
        configurable: { thread_id: runId },
      },
    );

    console.log("Result : " , JSON.stringify(result , null , 4));

    // 5 — graph paused at humanCheck, send jobs to frontend for review
    res.status(200).json({
      runId,
      status: result.status,
      jobs: result.filteredJobs.map((job: any) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        score: job.score,
        reasoning: job.reasoning,
        matchedSkills: job.matchedSkills,
        missingSkills: job.missingSkills,
        coverLetter: result.coverLetters[job.id],
      })),
    });
  } catch (error) {
    console.error("Agent error:", error);
    res.status(500).json({ error: "Agent failed" });
  }
}
