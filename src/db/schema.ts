import { db } from "./client"

export async function setupDatabase() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS applications (
      id             SERIAL PRIMARY KEY,
      run_id         TEXT NOT NULL,
      job_id         TEXT NOT NULL,
      title          TEXT NOT NULL,
      company        TEXT NOT NULL,
      location       TEXT NOT NULL,
      apply_url      TEXT NOT NULL,
      score          INTEGER NOT NULL,
      reasoning      TEXT NOT NULL,
      matched_skills JSONB NOT NULL,
      missing_skills JSONB NOT NULL,
      cover_letter   TEXT NOT NULL,
      status         TEXT NOT NULL,
      applied_at     TEXT NOT NULL
    )
  `)
  console.log("✅ Database ready")
}