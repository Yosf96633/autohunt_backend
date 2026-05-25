import type { AgentStateType } from "../state";
import { scrapeJobs } from "../../services/scraper.service";
import { mockRawJobs } from "../../mock/mockData";

export async function scraperNode(
  state: AgentStateType,
): Promise<Partial<AgentStateType>> {
  if (state.mock) {
    console.log("🧪 MOCK: skipping job scraping");
    return { rawJobs: mockRawJobs, status: "scoring" };
  }
  const jobs = await scrapeJobs(state.preferences.targetRoles);

  return {
    rawJobs: jobs,
    status: "scoring",
  };
}
