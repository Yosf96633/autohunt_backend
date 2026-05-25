import type { ParsedCV } from "../types/agent.types"
import type { RawJob, ScoredJob } from "../validators/job.validator"

export const mockParsedCV: ParsedCV = {
  name: "Muhammad Yousaf",
  email: "yousaf.dev18@gmail.com",
  phone: "+92 335 8485732",
  skills: ["JavaScript", "TypeScript", "React.js", "Next.js", "Node.js", "Python", "LangChain", "LangGraph"],
  stack: ["React", "Next.js", "Node.js", "Python"],
  experience: [],
  projects: [],
  education: [],
  totalYearsExperience: 1,
  summary: "Full stack developer with AI expertise"
}

export const mockRawJobs: RawJob[] = [
  {
    id: "mock-001",
    title: "Frontend Engineer",
    company: "Mock Corp",
    location: "Remote",
    description: "We need a React developer with TypeScript experience.",
    applyUrl: "https://example.com/apply",
    source: "remoteok",
    postedAt: null
  },
  {
    id: "mock-002",
    title: "Full Stack Engineer",
    company: "Test Inc",
    location: "Remote",
    description: "Looking for Next.js and Node.js developer.",
    applyUrl: "https://example.com/apply2",
    source: "remoteok",
    postedAt: null
  }
]

export const mockScoredJobs: ScoredJob[] = [
  {
    ...mockRawJobs[0]!,
    score: 8,
    reasoning: "Strong React and TypeScript match",
    matchedSkills: ["React.js", "TypeScript"],
    missingSkills: ["GraphQL"]
  },
  {
    ...mockRawJobs[1]!,
    score: 7,
    reasoning: "Good Next.js and Node.js fit",
    matchedSkills: ["Next.js", "Node.js"],
    missingSkills: ["Docker"]
  }
]