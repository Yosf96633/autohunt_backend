import { db } from "../db/client";
import type { JobApplication } from "../types/agent.types";
import { DigestSummary } from "../types/digest.types";

export async function logApplications(
  runId: string,
  applications: JobApplication[],
) {
  for (const app of applications) {
    await db.query(
      `
      INSERT INTO applications (
        thread_id, job_id, title, company, location,
        apply_url, score, reasoning, matched_skills,
        missing_skills, cover_letter, status, applied_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13
      )
    `,
      [
        runId,
        app.job.id,
        app.job.title,
        app.job.company,
        app.job.location,
        app.job.applyUrl,
        app.job.score,
        app.job.reasoning,
        JSON.stringify(app.job.matchedSkills),
        JSON.stringify(app.job.missingSkills),
        app.coverLetter,
        app.status,
        app.appliedAt ?? new Date().toISOString(),
      ],
    );
  }

  console.log(
    `📝 Tracked ${applications.length} applications for run ${runId}`,
  );
}

export async function logStats(
  thread_id: string,
  cv_name: string,
  raw_jobs: number,
  filtered_jobs: number,
  applications: number,
) {
  await db.query(
    `
      INSERT INTO thread_stats (
        thread_id, cv_name, raw_jobs , filtered_jobs,
        application
      ) VALUES (
        $1, $2, $3, $4, $5
      )
    `,
    [thread_id, cv_name, raw_jobs, filtered_jobs, applications],
  );
  console.log(`📝Stats are stored  for thread id ${thread_id}`);
}

export async function getApplicationsByThreadId(runId: string) {
  const result = await db.query(
    `SELECT * FROM applications WHERE thread_id = $1`,
    [runId],
  );
  return result.rows;
}

export async function getAllApplications() {
  const result = await db.query(
    `SELECT * FROM applications ORDER BY applied_at DESC`,
  );
  return result.rows;
}
