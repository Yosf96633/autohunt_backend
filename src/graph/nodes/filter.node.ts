import type { AgentStateType } from "../state"

export async function filterNode(state: AgentStateType): Promise<Partial<AgentStateType>> {
  const threshold = state.preferences.scoreThreshold

  const filteredJobs = state.scoredJobs.filter(job => job.score >= threshold)

  return {
    filteredJobs,
    status: "writing_cover_letters"
  }
}