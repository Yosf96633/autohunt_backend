import { ChatOpenAI } from "@langchain/openai"
import type { ScoredJob } from "../validators/job.validator"
import type { ParsedCV } from "../types/agent.types"

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7, // slight creativity for cover letters
  apiKey: process.env.OPENAI_API_KEY
})

async function writeSingleCoverLetter(job: ScoredJob, parsedCV: ParsedCV): Promise<string> {
  const result = await llm.invoke([
    {
      role: "system",
      content: `
        You are an expert cover letter writer.
        Write concise, professional, and tailored cover letters.
        Keep it under 250 words.
        Do not use generic phrases like "I am writing to apply".
        Start strong, be specific, end with a clear call to action.
      `.trim()
    },
    {
      role: "user",
      content: `
        Write a cover letter for this job using the candidate information below.

        CANDIDATE NAME: ${parsedCV.name}
        SKILLS: ${parsedCV.skills.join(", ")}
        STACK: ${parsedCV.stack.join(", ")}
        EXPERIENCE: ${parsedCV.totalYearsExperience} years
        MATCHED SKILLS FOR THIS JOB: ${job.matchedSkills.join(", ")}

        JOB TITLE: ${job.title}
        COMPANY: ${job.company}
        JOB DESCRIPTION: ${job.description}
      `.trim()
    }
  ])

  return result.content as string
}

export async function writeCoverLetters(
  jobs: ScoredJob[],
  parsedCV: ParsedCV
): Promise<Record<string, string>> {
  const results = await Promise.all(
    jobs.map(async job => {
      const letter = await writeSingleCoverLetter(job, parsedCV)
      return [job.id, letter] as [string, string]
    })
  )

  // { jobId → coverLetter }
  return Object.fromEntries(results)
}