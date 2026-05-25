import { z } from "zod"

export const RawJobSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  location: z.string(),
  description: z.string(),
  applyUrl: z.string(),
  source: z.string(),
  postedAt: z.string().nullable()
})

export const RawJobsSchema = z.array(RawJobSchema)

// ── Scored Job
export const ScoredJobSchema = RawJobSchema.extend({
  score: z.number().min(1).max(10),
  reasoning: z.string(),
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string())
})

export const ScoredJobsSchema = z.array(ScoredJobSchema)

export type RawJob = z.infer<typeof RawJobSchema>
export type ScoredJob = z.infer<typeof ScoredJobSchema>