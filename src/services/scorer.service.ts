import { ChatOpenAI } from "@langchain/openai"
import { z } from "zod"
import { ScoredJobSchema, type RawJob, type ScoredJob } from "../validators/job.validator"
import type { ParsedCV } from "../types/agent.types"



const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY
}).withStructuredOutput(ScoredJobSchema)

// ── CV summary built once, reused for every job
function buildCVSummary(parsedCV: ParsedCV): string {
  return `
    CANDIDATE SKILLS: ${parsedCV.skills.join(", ")}
    CANDIDATE STACK: ${parsedCV.stack.join(", ")}
    TOTAL EXPERIENCE: ${parsedCV.totalYearsExperience} years
  `.trim()
}

// ── Score a single job
async function scoreSingleJob(job: RawJob, cvSummary: string): Promise<ScoredJob> {
  const result = await llm.invoke([
    {
      role: "system",
      content: `
        You are a job fit analyzer.
        Given a candidate CV and a job description, score how well the candidate fits the job.
        Score from 1 to 10 where:
        10 = perfect fit
        7-9 = strong fit, minor gaps
        4-6 = partial fit, notable gaps
        1-3 = poor fit
        Be honest and precise.
      `.trim()
    },
    {
      role: "user",
      content: `
        ${cvSummary}

        JOB TITLE: ${job.title}
        COMPANY: ${job.company}
        JOB DESCRIPTION: ${job.description}
      `.trim()
    }
  ])

  return {
    ...job,
    score: result.score,
    reasoning: result.reasoning,
    matchedSkills: result.matchedSkills,
    missingSkills: result.missingSkills
  }
}

// ── Score all jobs in parallel
export async function scoreJobs(jobs: RawJob[], parsedCV: ParsedCV): Promise<ScoredJob[]> {
  const cvSummary = buildCVSummary(parsedCV)

  const scoredJobs = await Promise.all(
    jobs.map(job => scoreSingleJob(job, cvSummary))
  )

  return scoredJobs
}