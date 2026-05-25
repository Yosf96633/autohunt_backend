import { ChatOpenAI } from "@langchain/openai"
import type { ParsedCV } from "../types/index"
import { ParsedCVSchema } from "../validators/cv.validator"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY
}).withStructuredOutput(ParsedCVSchema)

async function extractTextFromPDF(cvBuffer: Buffer): Promise<string> {
  const uint8Array = new Uint8Array(cvBuffer)
  const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise

  let fullText = ""

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item: any) => item.str)
      .join(" ")
    fullText += pageText + "\n"
  }

  return fullText
}

export async function extractStructuredCV(cvBuffer: Buffer): Promise<ParsedCV> {
  const rawText = await extractTextFromPDF(cvBuffer)

  const parsedCV = await llm.invoke([
    {
      role: "system",
      content: "You are a CV parser. Extract all information from the CV text accurately."
    },
    {
      role: "user",
      content: `Here is the CV text:\n\n${rawText}`
    }
  ])

  return parsedCV
}