import type { AgentStateType } from "../state"
import { generateDigest } from "../../services/digest.service"

export async function digestNode(state: AgentStateType): Promise<Partial<AgentStateType>> {
  const summary = generateDigest(
    state.runId,
    state.rawJobs.length,
    state.filteredJobs.length,
    state.applications
  )

  return {
    digest: JSON.stringify(summary),
    status: "done"
  }
}