import type { Request, Response } from "express";
import { db } from "../db/client";

export async function getThreadData(req: Request, res: Response) {
  try {
    const { thread_id } = req.params;

    if (!thread_id) {
      res.status(400).json({ success: false, message: "Thread ID is required" });
      return;
    }

    // Fetch stats for this thread
    const statsResult = await db.query(
      `SELECT * FROM thread_stats WHERE thread_id = $1 LIMIT 1`,
      [thread_id]
    );

    // Fetch all applications for this thread
    const applicationsResult = await db.query(
      `SELECT * FROM applications WHERE thread_id = $1 ORDER BY applied_at DESC`,
      [thread_id]
    );

    const stats = statsResult.rows[0] ?? null;
    const applications = applicationsResult.rows;

    // No data at all for this thread
    if (!stats && applications.length === 0) {
      res.status(200).json({
        success: true,
        empty: true,
        message: "No data found for this thread",
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      empty: false,
      data: {
        thread_id,
        stats: stats
          ? {
              cvName: stats.cv_name,
              rawJobs: stats.raw_jobs,
              filteredJobs: stats.filtered_jobs,
              applications: stats.application,
              createdAt: stats.created_at,
            }
          : null,
        applications: applications.map((app) => ({
          id: app.id,
          jobId: app.job_id,
          title: app.title,
          company: app.company,
          location: app.location,
          applyUrl: app.apply_url,
          score: app.score,
          reasoning: app.reasoning,
          matchedSkills: app.matched_skills,
          missingSkills: app.missing_skills,
          coverLetter: app.cover_letter,
          status: app.status,
          appliedAt: app.applied_at,
        })),
      },
    });
  } catch (error) {
    console.error("Thread fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch thread data" });
  }
}