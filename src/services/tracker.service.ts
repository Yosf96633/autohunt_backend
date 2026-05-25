import { db } from "../db/client"
import type { JobApplication } from "../types/agent.types"

export async function logApplications(runId: string, applications: JobApplication[]) {
  for (const app of applications) {
    await db.query(`
      INSERT INTO applications (
        run_id, job_id, title, company, location,
        apply_url, score, reasoning, matched_skills,
        missing_skills, cover_letter, status, applied_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13
      )
    `, [
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
      app.appliedAt ?? new Date().toISOString()
    ])
  }

  console.log(`📝 Tracked ${applications.length} applications for run ${runId}`)
}

export async function getApplicationsByRunId(runId: string) {
  const result = await db.query(
    `SELECT * FROM applications WHERE run_id = $1`,
    [runId]
  )
  return result.rows
}

export async function getAllApplications() {
  const result = await db.query(
    `SELECT * FROM applications ORDER BY applied_at DESC`
  )
  return result.rows
}