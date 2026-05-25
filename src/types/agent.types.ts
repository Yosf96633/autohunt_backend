export interface ParsedCV {
  name: string;
  email: string;
  phone: string | null;
  skills: string[];
  stack: string[]; // specific technologies e.g. Next.js, FastAPI
  experience: Experience[];
  projects: Project[];
  education: Education[];
  totalYearsExperience: number;
  summary: string | null;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  responsibilities: string[];
  technologies: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface RawJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  applyUrl: string;
  source: string; // which job board it came from
  postedAt: string | null;
}

export interface ScoredJob extends RawJob {
  score: number; // 1-10
  reasoning: string;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface JobApplication {
  job: ScoredJob;
  coverLetter: string;
  status: "applied" | "saved" | "skipped";
  appliedAt: string | null;
}

export type RunStatus =
  | "validating"
  | "parsing_cv"
  | "scraping"
  | "scoring"
  | "filtering"
  | "writing_cover_letters"
  | "awaiting_review" // human in the loop pause point
  | "applying"
  | "tracking"
  | "done"
  | "error";
