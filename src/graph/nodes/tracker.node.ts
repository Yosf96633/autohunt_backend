import type { AgentStateType } from "../state"
import { logApplications } from "../../services/tracker.service"

export async function trackerNode(state: AgentStateType): Promise<Partial<AgentStateType>> {
  await logApplications(state.runId, state.applications)

  return {
    status: "done"
  }
}