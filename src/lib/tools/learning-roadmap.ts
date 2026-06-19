import { tool } from "ai";
import { z } from "zod";
import { StudentLevel } from "@/lib/types";

export function createLearningRoadmapTool(
  level: StudentLevel,
  studiedTopics: string[]
) {
  return tool({
    description:
      "Create a personalized learning roadmap for a programming career path or technology. Takes into account the student's current level and topics they have already studied.",
    parameters: z.object({
      goal: z
        .string()
        .describe(
          "The learning goal or career path (e.g., 'Backend Developer', 'Frontend Developer', 'Machine Learning Engineer', 'DevOps Engineer')"
        ),
      timeframeMonths: z
        .number()
        .min(1)
        .max(24)
        .default(6)
        .describe("Target timeframe in months to complete the roadmap"),
    }),
    execute: async ({ goal, timeframeMonths }) => {
      const alreadyStudied =
        studiedTopics.length > 0
          ? `The student has already studied: ${studiedTopics.join(", ")}. Skip these or mark them as completed.`
          : "The student is starting fresh.";

      const levelInstructions = {
        beginner: `Create a comprehensive beginner-friendly roadmap for "${goal}" over ${timeframeMonths} months.
          - Start with absolute fundamentals (programming basics, tools setup)
          - Progress slowly and logically, one concept at a time
          - Recommend beginner-friendly resources (freeCodeCamp, The Odin Project, official docs)
          - Include practical mini-projects after each phase
          - Estimate realistic time per topic for a beginner (2-4 hrs/week)
          - Use encouraging language`,

        intermediate: `Create an intermediate-level roadmap for "${goal}" over ${timeframeMonths} months.
          - Skip absolute basics, focus on advancing skills
          - Include industry-standard tools and workflows
          - Recommend intermediate resources (official docs, Fireship, Traversy Media)
          - Include real-world project ideas that build a portfolio
          - Mention certifications or community involvement
          - Estimate time for someone studying 5-10 hrs/week`,

        advanced: `Create an advanced, career-focused roadmap for "${goal}" over ${timeframeMonths} months.
          - Focus on architecture, system design, and specializations
          - Include open-source contribution opportunities
          - Recommend advanced resources (papers, conference talks, GitHub repos)
          - Include large portfolio project ideas
          - Cover soft skills: system design interviews, code reviews, mentoring
          - Estimate time for someone studying 10-20 hrs/week`,
      };

      return {
        type: "roadmap",
        goal,
        level,
        timeframeMonths,
        alreadyStudied,
        instructions: levelInstructions[level],
        prompt: `You are an expert software engineering mentor. Create a detailed, actionable learning roadmap.

Goal: ${goal}
Student Level: ${level}
Timeframe: ${timeframeMonths} months
${alreadyStudied}

${levelInstructions[level]}

Format the roadmap as:
## 🎯 Goal: ${goal}
## 📅 Timeline: ${timeframeMonths} months

### Phase 1: [Phase Name] (Month X-Y)
**Topics:**
- Topic 1
- Topic 2

**Resources:**
- Resource 1
- Resource 2

**Project:** [Mini project to practice]

[Repeat for each phase]

## 🚀 Final Project Ideas
## 📚 Recommended Books/Courses
## 💡 Pro Tips for ${level} learners`,
      };
    },
  });
}
