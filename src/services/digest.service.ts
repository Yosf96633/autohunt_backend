import type { JobApplication } from "../types/agent.types"
import { DigestSummary } from "../types/digest.types"


export function generateDigest(
  runId: string,
  rawJobsCount: number,
  filteredJobsCount: number,
  applications: JobApplication[]
): DigestSummary {
  const applied = applications.filter(a => a.status === "applied")
  const skipped = applications.filter(a => a.status === "skipped")

  const topMatch = applied.reduce((best, current) => {
    if (!best) return current
    return current.job.score > best.job.score ? current : best
  }, null as JobApplication | null)

  return {
    runId,
    totalScraped: rawJobsCount,
    totalFiltered: filteredJobsCount,
    totalApplied: applied.length,
    totalSkipped: skipped.length,
    appliedJobs: applied.map(a => ({
      title: a.job.title,
      company: a.job.company,
      score: a.job.score,
      status: a.status,
      appliedAt: a.appliedAt ?? ""
    })),
    topMatch: topMatch ? {
      title: topMatch.job.title,
      company: topMatch.job.company,
      score: topMatch.job.score
    } : null,
    completedAt: new Date().toISOString()
  }
}