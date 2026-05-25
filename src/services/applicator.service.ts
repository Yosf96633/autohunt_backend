import { applyToJob, detectATS } from "../tools/playwright.tool"
import type { ScoredJob } from "../validators/job.validator"
import type { ParsedCV } from "../types/agent.types"
import { ApplicationResult } from "../types/application.types"

export async function applyToJobs(
  jobs: ScoredJob[],
  parsedCV: ParsedCV,
  coverLetters: Record<string, string>,
  cvBuffer: Buffer
): Promise<ApplicationResult[]> {
  const results: ApplicationResult[] = []

  // Apply sequentially — not parallel
  // Parallel Playwright = gets flagged as bot immediately
  for (const job of jobs) {
    const ats = detectATS(job.applyUrl)

    if (ats === "unknown") {
      results.push({
        job,
        success: false,
        message: "Skipped — unsupported ATS",
        appliedAt: new Date().toISOString()
      })
      continue
    }

    console.log(`🤖 Applying to ${job.title} at ${job.company} via ${ats}`)

    const coverLetter = coverLetters[job.id] ?? ""
    const result = await applyToJob(job.applyUrl, parsedCV, coverLetter, cvBuffer)

    results.push({
      job,
      success: result.success,
      message: result.message,
      appliedAt: new Date().toISOString()
    })

    // Random delay between applications — avoid bot detection
    const delay = Math.floor(Math.random() * 3000) + 2000
    await new Promise(res => setTimeout(res, delay))
  }

  return results
}