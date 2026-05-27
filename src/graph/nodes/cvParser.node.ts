import type { AgentStateType } from "../state";
import { extractStructuredCV } from "../../services/cv.service";
import { mockParsedCV } from "../../mock/mockData";

export async function cvParserNode(
  state: AgentStateType,
): Promise<Partial<AgentStateType>> {
  if (state.mock) {
    console.log("🧪 MOCK: skipping CV parsing");
    return { parsedCV: mockParsedCV, status: "scraping" };
  }
  const parsedCV = await extractStructuredCV(state.cvBuffer);
  return {
    parsedCV,
    status: "scraping",
  };
}
