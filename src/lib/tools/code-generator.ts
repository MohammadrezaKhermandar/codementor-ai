import { tool } from "ai";
import { z } from "zod";
import { StudentLevel } from "@/lib/types";

export function createCodeGeneratorTool(level: StudentLevel) {
  return tool({
    description:
      "Generate code examples and educational programming samples for a given topic or task. Adapts code complexity and explanation depth to student level.",
    parameters: z.object({
      topic: z
        .string()
        .describe(
          "The programming concept or task to generate code for (e.g., 'FastAPI CRUD example', 'React useState hook')"
        ),
      language: z
        .string()
        .optional()
        .describe(
          "Programming language or framework (auto-detected from topic if not specified)"
        ),
    }),
    execute: async ({ topic, language }) => {
      const levelInstructions = {
        beginner: `Generate a simple, well-commented code example for "${topic}"${language ? ` in ${language}` : ""}.
          - Add a comment on almost every line explaining what it does
          - Use simple variable names that are self-explanatory
          - Avoid complex patterns or abstractions
          - Include a "What is this?" section before the code
          - After the code, add a "How it works" step-by-step walkthrough`,

        intermediate: `Generate a practical, production-like code example for "${topic}"${language ? ` in ${language}` : ""}.
          - Add comments only for non-obvious logic
          - Show common patterns and best practices
          - Include error handling
          - After the code, add notes about alternative approaches
          - Mention potential improvements or extensions`,

        advanced: `Generate a sophisticated, production-ready code example for "${topic}"${language ? ` in ${language}` : ""}.
          - Include advanced patterns (e.g., design patterns, optimizations)
          - Add TypeScript types / proper interfaces if applicable
          - Include performance considerations
          - After the code, add a deep-dive section covering:
            * Under-the-hood mechanics
            * Time/space complexity if applicable
            * Trade-offs vs alternative approaches
            * Links to relevant RFCs or specs`,
      };

      return {
        type: "code",
        topic,
        language,
        level,
        instructions: levelInstructions[level],
        prompt: `You are an expert programming educator. ${levelInstructions[level]}

Use proper markdown code blocks with syntax highlighting. Generate the code example now.`,
      };
    },
  });
}
