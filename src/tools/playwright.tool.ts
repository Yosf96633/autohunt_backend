import { chromium } from "playwright"
import type { ParsedCV } from "../types/agent.types"
import * as fs from "fs"
import * as path from "path"
import * as os from "os"
import { ApplyResult } from "../types/application.types"


// ── Detect which ATS the URL belongs to
export function detectATS(url: string): "greenhouse" | "lever" | "unknown" {
  if (url.includes("greenhouse.io")) return "greenhouse"
  if (url.includes("lever.co")) return "lever"
  return "unknown"
}

// ── Save CV buffer to a temp file for upload
async function saveCVToTemp(cvBuffer: Buffer): Promise<string> {
  const tempPath = path.join(os.tmpdir(), `cv_${Date.now()}.pdf`)
  fs.writeFileSync(tempPath, cvBuffer)
  return tempPath
}

// ── Apply via Greenhouse
async function applyGreenhouse(
  page: any,
  parsedCV: ParsedCV,
  coverLetter: string,
  cvPath: string
): Promise<void> {
  // Basic fields
  await page.fill('input[name="first_name"]', parsedCV.name.split(" ")[0] ?? "")
  await page.fill('input[name="last_name"]', parsedCV.name.split(" ").slice(1).join(" ") ?? "")
  await page.fill('input[name="email"]', parsedCV.email)

  if (parsedCV.phone) {
    await page.fill('input[name="phone"]', parsedCV.phone)
  }

  // Resume upload
  const resumeInput = page.locator('input[type="file"]').first()
  await resumeInput.setInputFiles(cvPath)

  // Cover letter — try textarea first, then file upload
  const coverLetterTextarea = page.locator('textarea[name="cover_letter"]')
  const hasCoverLetterTextarea = await coverLetterTextarea.count()

  if (hasCoverLetterTextarea > 0) {
    await coverLetterTextarea.fill(coverLetter)
  }

  // LinkedIn if field exists
  const linkedinField = page.locator('input[name="job_application[answers_attributes][0][text_value]"]')
  const hasLinkedin = await linkedinField.count()
  if (hasLinkedin > 0) {
    await linkedinField.fill("")
  }

  // Submit
  await page.click('button#submit_app, input[type="submit"]')
  await page.waitForTimeout(3000)
}

// ── Apply via Lever
async function applyLever(
  page: any,
  parsedCV: ParsedCV,
  coverLetter: string,
  cvPath: string
): Promise<void> {
  // Basic fields
  await page.fill('input[name="name"]', parsedCV.name)
  await page.fill('input[name="email"]', parsedCV.email)

  if (parsedCV.phone) {
    await page.fill('input[name="phone"]', parsedCV.phone)
  }

  // Resume upload
  const resumeInput = page.locator('input[type="file"]').first()
  await resumeInput.setInputFiles(cvPath)

  // Cover letter textarea
  const coverLetterField = page.locator('textarea[name="comments"]')
  const hasCoverLetter = await coverLetterField.count()
  if (hasCoverLetter > 0) {
    await coverLetterField.fill(coverLetter)
  }

  // Submit
  await page.click('button[type="submit"]')
  await page.waitForTimeout(3000)
}

// ── Main apply function
export async function applyToJob(
  applyUrl: string,
  parsedCV: ParsedCV,
  coverLetter: string,
  cvBuffer: Buffer
): Promise<ApplyResult> {
  const ats = detectATS(applyUrl)

  if (ats === "unknown") {
    return { success: false, message: "Unknown ATS — skipping" }
  }

  const cvPath = await saveCVToTemp(cvBuffer)
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  try {
    await page.goto(applyUrl, { waitUntil: "networkidle", timeout: 30000 })

    if (ats === "greenhouse") {
      await applyGreenhouse(page, parsedCV, coverLetter, cvPath)
    } else {
      await applyLever(page, parsedCV, coverLetter, cvPath)
    }

    // Check for success indicator
    const success = await page.locator(
      'text=Thank you, text=Application submitted, text=Successfully applied'
    ).count()

    return {
      success: success > 0,
      message: success > 0 ? "Applied successfully" : "Submitted but could not confirm"
    }

  } catch (error: any) {
    return { success: false, message: `Failed: ${error.message}` }
  } finally {
    await browser.close()
    fs.unlinkSync(cvPath) // cleanup temp file
  }
}