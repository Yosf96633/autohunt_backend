import type { AgentStateType } from "../state"
import { writeCoverLetters } from "../../services/coverLetter.service"
import { mockScoredJobs } from "../../mock/mockData"
export async function coverLetterNode(state: AgentStateType): Promise<Partial<AgentStateType>> {
  if (state.mock) {
    console.log("🧪 MOCK: skipping cover letter generation")
    const mockLetters: Record<string, string> = {}
    state.filteredJobs.forEach(job => {
      mockLetters[job.id] = `Mock cover letter for ${job.title} at ${job.company}`
    })
    return { coverLetters: mockLetters, status: "awaiting_review" }
  }
  const coverLetters = await writeCoverLetters(state.filteredJobs, state.parsedCV!)

  return {
    coverLetters,
    status: "awaiting_review"
  }
}