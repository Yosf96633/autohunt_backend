import { RawJobsSchema, type RawJob } from "../validators/job.validator"

const EXCLUDED_KEYWORDS = [
  "marketing", "sales", "designer", "accountant",
  "hr ", "recruiter", "copywriter", "seo", "social media"
]

async function fetchJobsByTag(tag: string): Promise<RawJob[]> {
  const response = await fetch(`https://remoteok.com/api?tags=${tag}`, {
    headers: { "User-Agent": "AutoHunt Job Agent/1.0" }
  })

  if (!response.ok) throw new Error(`RemoteOK API failed: ${response.status}`)

  const data = await response.json()
  const jobs = data.slice(1) // remove legal notice

  return jobs.map((job: any) => ({
    id: String(job.id ?? ""),
    title: job.position ?? "",
    company: job.company ?? "",
    location: job.location ?? "Remote",
    description: job.description ?? "",
    applyUrl: job.apply_url ?? job.url ?? "",
    source: "remoteok",
    postedAt: job.date ?? ""
  }))
}

export async function scrapeJobs(roles: string[]): Promise<RawJob[]> {
  // fetch all tags in parallel
  const results = await Promise.all(
    roles.map(role => fetchJobsByTag(role.toLowerCase()))
  )

  // flatten all results
  const allJobs = results.flat()

  // deduplicate by id
  const seen = new Set<string>()
  const uniqueJobs = allJobs.filter(job => {
    if (seen.has(job.id)) return false
    seen.add(job.id)
    return true
  })

  // exclude irrelevant titles
  const filtered = uniqueJobs.filter(job => {
    const title = job.title.toLowerCase()
    return !EXCLUDED_KEYWORDS.some(kw => title.includes(kw))
  })

  return RawJobsSchema.parse(filtered)
}