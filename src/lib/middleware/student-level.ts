import { StudentLevel, StudentContext } from "@/lib/types";

export function buildStudentLevelSystemPrompt(student: StudentContext): string {
  const levelDescriptions: Record<StudentLevel, string> = {
    beginner: `The student is a BEGINNER.
- Use very simple language, avoid jargon
- Explain every technical term the first time you use it
- Use analogies and real-world comparisons
- Provide step-by-step guidance
- Be encouraging and patient
- Show complete, working code examples with comments on every important line
- Break down complex concepts into tiny digestible pieces`,

    intermediate: `The student is INTERMEDIATE level.
- Use standard technical terminology
- Assume knowledge of programming basics and common patterns
- Focus on best practices and idiomatic code
- Show code examples with comments only on non-obvious parts
- Mention alternative approaches and trade-offs
- Encourage exploration of related concepts`,

    advanced: `The student is ADVANCED level.
- Use precise technical language freely
- Discuss internals, performance implications, and edge cases
- Reference relevant RFCs, specs, or source code when applicable
- Show production-quality code with minimal hand-holding
- Discuss architectural decisions and design patterns
- Challenge them with thought-provoking follow-up questions`,
  };

  const techContext =
    student.favoriteTechnologies.length > 0
      ? `\nThe student's favorite technologies are: ${student.favoriteTechnologies.join(", ")}. Use these as examples or references when possible.`
      : "";

  const roadmapContext = student.currentRoadmap
    ? `\nThe student is currently following a roadmap for: ${student.currentRoadmap}.`
    : "";

  const studiedContext =
    student.studiedTopics.length > 0
      ? `\nTopics the student has already studied: ${student.studiedTopics.join(", ")}. Do not re-explain fundamentals they already know.`
      : "";

  return `${levelDescriptions[student.level]}${techContext}${roadmapContext}${studiedContext}`;
}

export function detectLevelFromMessage(message: string): StudentLevel | null {
  const lowerMsg = message.toLowerCase();

  const beginnerKeywords = [
    "what is",
    "what are",
    "how do i start",
    "i am new",
    "i'm new",
    "beginner",
    "never used",
    "first time",
    "don't understand",
    "confused about basics",
  ];

  const advancedKeywords = [
    "internals",
    "performance",
    "optimization",
    "architecture",
    "scalability",
    "concurrency",
    "memory leak",
    "garbage collection",
    "microservices",
    "system design",
  ];

  if (advancedKeywords.some((kw) => lowerMsg.includes(kw))) return "advanced";
  if (beginnerKeywords.some((kw) => lowerMsg.includes(kw))) return "beginner";

  return null;
}

export function extractTechnologiesFromMessage(message: string): string[] {
  const techKeywords = [
    "react",
    "next.js",
    "nextjs",
    "vue",
    "angular",
    "svelte",
    "python",
    "javascript",
    "typescript",
    "node",
    "express",
    "fastapi",
    "django",
    "flask",
    "rust",
    "go",
    "java",
    "spring",
    "docker",
    "kubernetes",
    "aws",
    "gcp",
    "azure",
    "postgresql",
    "mongodb",
    "redis",
    "graphql",
    "rest",
  ];

  const lowerMsg = message.toLowerCase();
  return techKeywords.filter((tech) => lowerMsg.includes(tech));
}
