export type JobBoard = "remoteok" | "arbeitnow" | "themuse"

export interface UserPreferences {
  targetRoles: string[]
  locations: string[]
  minSalary?: number
  scoreThreshold: number        
  autoApply: boolean
  jobBoards: JobBoard[]
  email: string                
}