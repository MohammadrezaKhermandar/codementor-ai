import { tool } from "ai";
import { z } from "zod";
import { StudentLevel } from "@/lib/types";

export function createQuizGeneratorTool(level: StudentLevel) {
  return tool({
    description:
      "Generate a programming quiz with multiple choice questions about a specific topic. Adapts complexity to student level.",
    parameters: z.object({
      topic: z
        .string()
        .describe("The programming topic to generate quiz questions about"),
      questionCount: z
        .number()
        .min(1)
        .max(10)
        .default(5)
        .describe("Number of quiz questions to generate"),
    }),
    execute: async ({ topic, questionCount }) => {
      const levelInstructions = {
        beginner: `Create ${questionCount} simple multiple-choice questions about "${topic}".
          - Use plain language without jargon
          - Focus on basic concepts and definitions
          - Include 4 answer options (A, B, C, D) with one correct answer
          - Add a brief explanation for each correct answer
          - Make questions straightforward and practical`,

        intermediate: `Create ${questionCount} intermediate multiple-choice questions about "${topic}".
          - Include both conceptual and practical questions
          - Cover common patterns and use cases
          - Include 4 answer options (A, B, C, D) with one correct answer
          - Add explanations that reference related concepts
          - Mix definition, application, and debugging scenarios`,

        advanced: `Create ${questionCount} advanced multiple-choice questions about "${topic}".
          - Focus on edge cases, performance, and deep internals
          - Include architecture, optimization, and tradeoff questions
          - Include 4 answer options (A, B, C, D) with one correct answer
          - Provide detailed technical explanations referencing specs or internals
          - Include questions about anti-patterns and best practices`,
      };

      return {
        type: "quiz",
        topic,
        level,
        instructions: levelInstructions[level],
        prompt: `You are an expert programming educator. ${levelInstructions[level]}

Format each question as:
**Question N:** [Question text]
A) [Option]
B) [Option]
C) [Option]
D) [Option]
✅ **Correct Answer:** [Letter] - [Brief explanation]

Generate the quiz now for topic: "${topic}"`,
      };
    },
  });
}
