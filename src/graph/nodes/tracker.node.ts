import type { AgentStateType } from "../state";
import { logApplications, logStats } from "../../services/tracker.service";

export async function trackerNode(
  state: AgentStateType,
): Promise<Partial<AgentStateType>> {
  await logApplications(state.runId, state.applications);
  await logStats(
    state.runId,
    state.cvName,
    state.rawJobs.length,
    state.filteredJobs.length,
    state.applications.length,
  );

  return {
    status: "done",
  };
}
