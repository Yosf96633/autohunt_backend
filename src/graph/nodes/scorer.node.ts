import type { AgentStateType } from "../state";
import { scoreJobs } from "../../services/scorer.service";
import { mockScoredJobs } from "../../mock/mockData";
export async function scorerNode(
  state: AgentStateType,
): Promise<Partial<AgentStateType>> {
  if (state.mock) {
    console.log("🧪 MOCK: skipping scoring");
    return { scoredJobs: mockScoredJobs, status: "filtering" };
  }
  const scoredJobs = await scoreJobs(state.rawJobs, state.parsedCV!);

  return {
    scoredJobs,
    status: "filtering",
  };
}
