import { Annotation } from "@langchain/langgraph"
import type {
  ParsedCV,
  RawJob,
  ScoredJob,
  JobApplication,
  RunStatus,
  UserPreferences
} from "../types/index"

export const AgentState = Annotation.Root({
  // ── Input
  cvBuffer: Annotation<Buffer>,
  preferences: Annotation<UserPreferences>,

  // ── Filled progressively by each node
  parsedCV: Annotation<ParsedCV | null>,
  rawJobs: Annotation<RawJob[]>,
  scoredJobs: Annotation<ScoredJob[]>,
  filteredJobs: Annotation<ScoredJob[]>,
  coverLetters: Annotation<Record<string, string>>,

  // ── Output
  applications: Annotation<JobApplication[]>,
  digest: Annotation<string>,

  // ── Meta
  status: Annotation<RunStatus>,
  runId: Annotation<string>,
  error: Annotation<string | null>,

  // Mock
  mock: Annotation<boolean>,

  // Data being passed after interrupt
  data_after_interruption : Annotation<string[]>
})

export type AgentStateType = typeof AgentState.State
export type AgentStateUpdate = Partial<AgentStateType>