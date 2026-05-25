import type { AgentStateType } from "../state"
import { applyToJobs } from "../../services/applicator.service"

export async function applicatorNode(state: AgentStateType): Promise<Partial<AgentStateType>> {
  if (state.mock) {
    console.log("🧪 MOCK: skipping real applications")
    return {
      applications: state.filteredJobs.map(job => ({
        job,
        coverLetter: state.coverLetters[job.id] ?? "",
        status: "applied" as const,
        appliedAt: new Date().toISOString()
      })),
      status: "tracking"
    }
  }

  const results = await applyToJobs(
    state.filteredJobs,
    state.parsedCV!,
    state.coverLetters,
    state.cvBuffer
  )

  const applications = results.map(r => ({
    job: r.job,
    coverLetter: state.coverLetters[r.job.id] ?? "",
    status: r.success ? "applied" as const : "skipped" as const,
    appliedAt: r.appliedAt
  }))

  return {
    applications,
    status: "tracking"
  }
}