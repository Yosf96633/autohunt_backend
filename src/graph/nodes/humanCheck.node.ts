import { interrupt } from "@langchain/langgraph"
import type { AgentStateType } from "../state"

export async function humanCheckNode(state: AgentStateType): Promise<Partial<AgentStateType>> {
  // pause the graph and send this data to frontend
  const decision = interrupt({
    jobs: state.filteredJobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      score: job.score,
      reasoning: job.reasoning,
      matchedSkills: job.matchedSkills,
      missingSkills: job.missingSkills,
      coverLetter: state.coverLetters[job.id]
    }))
  })

  // when user resumes, decision contains approved job ids
  const approvedIds: string[] = decision.approvedIds

  const approvedJobs = state.filteredJobs.filter(job =>
    approvedIds.includes(job.id)
  )

  return {
    filteredJobs: approvedJobs,
    status: "applying"
  }
}