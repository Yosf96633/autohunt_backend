export interface DigestSummary {
  totalScraped: number
  totalFiltered: number
  totalApplied: number
  totalSkipped: number
  appliedJobs: {
    title: string
    company: string
    score: number
    status: string
    appliedAt: string
  }[]
  topMatch: {
    title: string
    company: string
    score: number
  } | null
  runId: string
  completedAt: string
}
