import { RawJobsSchema, type RawJob } from "../validators/job.validator";

const EXCLUDED_KEYWORDS = [
  "marketing",
  "sales",
  "designer",
  "accountant",
  "hr ",
  "recruiter",
  "copywriter",
  "seo",
  "social media",
];
const DAYS_THRESHOLD = 5;

function isRecent(postedAt: string | null): boolean {
  if (!postedAt) return false;
  const posted = new Date(postedAt);
  const now = new Date();
  const diffDays = (now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= DAYS_THRESHOLD;
}

async function fetchJobsByTag(tag: string): Promise<RawJob[]> {
  const response = await fetch(`https://remoteok.com/api?tags=${tag}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://remoteok.com/",
    },
  });

  if (!response.ok) throw new Error(`RemoteOK API failed: ${response.status}`);

  const data = await response.json();
  const jobs = data.slice(1);

  return jobs.map((job: any) => ({
    id: String(job.id ?? ""),
    title: job.position ?? "",
    company: job.company ?? "",
    location: job.location ?? "Remote",
    description: job.description ?? "",
    applyUrl: job.apply_url ?? job.url ?? "",
    source: "remoteok",
    postedAt: job.date ?? null,
  }));
}

export async function scrapeJobs(roles: string[]): Promise<RawJob[]> {
  const results = await Promise.all(
    roles.map((role) => fetchJobsByTag(role.toLowerCase())),
  );

  const allJobs = results.flat();

  // deduplicate by id
  const seen = new Set<string>();
  const uniqueJobs = allJobs.filter((job) => {
    if (seen.has(job.id)) return false;
    seen.add(job.id);
    return true;
  });

  // exclude irrelevant titles
  const roleFiltered = uniqueJobs.filter((job) => {
    const title = job.title.toLowerCase();
    return !EXCLUDED_KEYWORDS.some((kw) => title.includes(kw));
  });

  // filter by date
  const recentJobs = roleFiltered.filter((job) => isRecent(job.postedAt));

  console.log(
    `📊 Total: ${allJobs.length} → Deduplicated: ${uniqueJobs.length} → Role filtered: ${roleFiltered.length} → Recent (${DAYS_THRESHOLD} days): ${recentJobs.length}`,
  );

  return RawJobsSchema.parse(recentJobs);
}
