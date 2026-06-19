import { AppContext, StudentContext, ConversationMessage } from "@/lib/types";
import {
  detectLevelFromMessage,
  extractTechnologiesFromMessage,
} from "./student-level";

export function updateContextFromMessage(
  context: AppContext,
  userMessage: string
): AppContext {
  const newContext = { ...context, student: { ...context.student } };

  // Auto-detect level if not explicitly set
  const detectedLevel = detectLevelFromMessage(userMessage);
  if (detectedLevel && context.student.level === "beginner") {
    newContext.student.level = detectedLevel;
  }

  // Extract technologies mentioned
  const newTechs = extractTechnologiesFromMessage(userMessage);
  if (newTechs.length > 0) {
    const combined = [
      ...new Set([...context.student.favoriteTechnologies, ...newTechs]),
    ];
    newContext.student.favoriteTechnologies = combined.slice(0, 10);
  }

  // Detect roadmap mentions
  const roadmapMatch = userMessage.match(
    /roadmap for (?:becoming a?n? )?(.+?)(?:\s|$)/i
  );
  if (roadmapMatch && !context.student.currentRoadmap) {
    newContext.student.currentRoadmap = roadmapMatch[1].trim();
  }

  return newContext;
}

export function addStudiedTopic(
  student: StudentContext,
  topic: string
): StudentContext {
  if (student.studiedTopics.includes(topic)) return student;
  return {
    ...student,
    studiedTopics: [...student.studiedTopics, topic].slice(-20),
  };
}

export function buildSystemPrompt(
  context: AppContext,
  conversationContext: string
): string {
  const basePrompt = `You are an intelligent programming education assistant. Your role is to teach, guide, and support students learning programming.

## Language Detection (CRITICAL RULE):
- Detect the language of the user's message automatically
- If the user writes in Persian (Farsi), respond ENTIRELY in Persian
- If the user writes in English, respond ENTIRELY in English
- Never mix languages in a single response
- Persian tool triggers: "کوییز بساز"، "مثال کد"، "بررسی کن"، "مسیر یادگیری" → use the corresponding tool

You have access to these tools:
- **generate_quiz**: Create quizzes about any programming topic
- **generate_code**: Generate code examples and educational samples
- **review_github**: Review GitHub repositories and provide feedback
- **create_roadmap**: Generate personalized learning roadmaps

When to use tools:
- User asks to "generate a quiz" / "کوییز بساز" / "تست بده" → use generate_quiz
- User asks for "an example" / "مثال بزن" / "کد بنویس" / "show me how to" → use generate_code
- User shares a GitHub URL or asks to "review" / "بررسی کن" → use review_github
- User asks for a "roadmap" / "مسیر یادگیری" / "چطور بشم" → use create_roadmap

${conversationContext ? `\n${conversationContext}\n` : ""}`;

  return basePrompt;
}

export function serializeContext(context: AppContext): string {
  return JSON.stringify({
    level: context.student.level,
    technologies: context.student.favoriteTechnologies,
    roadmap: context.student.currentRoadmap,
    topics: context.student.studiedTopics,
    hasSummary: !!context.conversationSummary,
  });
}

export function addMessageToHistory(
  context: AppContext,
  message: ConversationMessage
): AppContext {
  return {
    ...context,
    conversationHistory: [...context.conversationHistory, message],
  };
}
