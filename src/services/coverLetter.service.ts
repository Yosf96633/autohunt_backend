import { ChatOpenAI } from "@langchain/openai";
import type { ScoredJob } from "../validators/job.validator";
import type { ParsedCV } from "../types/agent.types";

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7, // slight creativity for cover letters
  apiKey: process.env.OPENAI_API_KEY,
});

async function writeSingleCoverLetter(
  job: ScoredJob,
  parsedCV: ParsedCV,
): Promise<string> {
  const result = await llm.invoke([
    {
      role: "system",
      content: `
You are an expert cover letter writer. Write sharp, specific, human-sounding cover letters.

Rules:
- Under 200 words
- Never use brackets, placeholders, or filler text
- Never start with "I am writing to apply" or "I am excited to apply"
- Start with a bold, job-specific opening statement
- Body: 2 short paragraphs — what you bring, why this role specifically
- End with exactly: "Best regards,\n[Candidate Full Name]\n[Email] | [Phone]"
- Output only the cover letter. No commentary, no extra text, no hashtags, no labels

EXAMPLE OUTPUT:
---
Building production AI systems that actually ship is where I thrive. At Mozzine Technologies, I led the end-to-end development of an AI customer support system — from LangGraph orchestration to FastAPI streaming — cutting response time by 60%.

For this Backend Engineer role at Acme Corp, my experience with FastAPI, PostgreSQL, and Redis maps directly to your stack. I've handled async pipelines, SSE streaming, and multi-agent workflows under real production constraints — not just side projects.

I'd love to walk you through what I've built and how it applies here.

Best regards,
Candidate's name
Candidate's email | Phone number
---`.trim(),
    },
    {
      role: "user",
      content: `
Write a cover letter for this job.

CANDIDATE: ${parsedCV.name}
EMAIL: ${parsedCV.email}
PHONE: ${parsedCV.phone}
SKILLS: ${parsedCV.skills.join(", ")}
EXPERIENCE: ${parsedCV.totalYearsExperience} year(s)
MATCHED SKILLS FOR THIS JOB: ${job.matchedSkills.join(", ")}

JOB TITLE: ${job.title}
COMPANY: ${job.company}
JOB DESCRIPTION: ${job.description}
    `.trim(),
    },
  ]);

  return result.content as string;
}

export async function writeCoverLetters(
  jobs: ScoredJob[],
  parsedCV: ParsedCV,
): Promise<Record<string, string>> {
  const results = await Promise.all(
    jobs.map(async (job) => {
      const letter = await writeSingleCoverLetter(job, parsedCV);
      return [job.id, letter] as [string, string];
    }),
  );

  // { jobId → coverLetter }
  return Object.fromEntries(results);
}
