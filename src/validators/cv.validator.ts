import { z } from "zod"

export const ExperienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  duration: z.string(),
  responsibilities: z.array(z.string()),
  technologies: z.array(z.string())
})

export const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  technologies: z.array(z.string())
})

export const EducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  year: z.string()
})

export const ParsedCVSchema = z.object({
  name: z.string(),
  email: z.string(),
  address : z.string().nullable(),
  phone: z.string().nullable(),
  skills: z.array(z.string()),
  stack: z.array(z.string()),
  experience: z.array(ExperienceSchema),
  projects: z.array(ProjectSchema),
  education: z.array(EducationSchema),
  totalYearsExperience: z.number(),
  summary: z.string().nullable()
})