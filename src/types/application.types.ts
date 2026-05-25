import { ScoredJob } from "./agent.types"


export interface ApplicationResult {
  job: ScoredJob
  success: boolean
  message: string
  appliedAt: string
}


export type ApplyResult = {
  success: boolean
  message: string
}