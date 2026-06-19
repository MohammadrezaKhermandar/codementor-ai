import { streamText, generateText } from "ai";
import { google } from "@ai-sdk/google";
import { createQuizGeneratorTool } from "@/lib/tools/quiz-generator";
import { createCodeGeneratorTool } from "@/lib/tools/code-generator";
import { createGitHubReviewTool } from "@/lib/tools/github-review";
import { createLearningRoadmapTool } from "@/lib/tools/learning-roadmap";
import { buildStudentLevelSystemPrompt } from "@/lib/middleware/student-level";
import {
  shouldSummarize,
  buildSummaryPrompt,
  buildContextWithSummary,
  getMessagesForContext,
} from "@/lib/middleware/conversation-summary";
import {
  updateContextFromMessage,
  buildSystemPrompt,
} from "@/lib/middleware/context-management";
import {
  AppContext,
  DEFAULT_APP_CONTEXT,
  ConversationMessage,
} from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, context: rawContext } = body;

  const context: AppContext = rawContext
    ? { ...DEFAULT_APP_CONTEXT, ...rawContext }
    : DEFAULT_APP_CONTEXT;

  const lastUserMessage = messages[messages.length - 1];
  const userMessageContent =
    typeof lastUserMessage.content === "string"
      ? lastUserMessage.content
      : Array.isArray(lastUserMessage.content)
      ? lastUserMessage.content.map((c: { text?: string }) => c.text || "").join("")
      : "";

  // Apply Context Management Middleware
  const updatedContext = updateContextFromMessage(context, userMessageContent);
  const student = updatedContext.student;

  // Apply Conversation Summary Middleware
  let conversationSummary = context.conversationSummary;
  const allHistory: ConversationMessage[] = context.conversationHistory || [];

  if (shouldSummarize(allHistory) && !conversationSummary) {
    try {
      const summaryResult = await generateText({
        model: google("gemini-2.0-flash"),
        prompt: buildSummaryPrompt(allHistory),
        maxTokens: 300,
      });
      conversationSummary = summaryResult.text;
    } catch {
      // Continue without summary if generation fails
    }
  }

  const recentHistory = getMessagesForContext(allHistory, !!conversationSummary);
  const conversationContext = buildContextWithSummary(
    conversationSummary,
    recentHistory
  );

  // Apply Student Level Middleware
  const levelPrompt = buildStudentLevelSystemPrompt(student);

  // Build full system prompt with all middleware
  const systemPrompt = buildSystemPrompt(updatedContext, conversationContext);
  const fullSystemPrompt = `${systemPrompt}

## Student Level Configuration:
${levelPrompt}

## Important Guidelines:
- When a tool returns a "prompt" field, use it as your internal instruction to generate the actual response
- Always generate the actual quiz questions, code examples, or roadmap content — don't just describe what you would do
- Format your responses with proper markdown for readability
- End responses with a follow-up question or suggestion when appropriate`;

  // Create tools with current student context
  const tools = {
    generate_quiz: createQuizGeneratorTool(student.level),
    generate_code: createCodeGeneratorTool(student.level),
    review_github: createGitHubReviewTool(student.level),
    create_roadmap: createLearningRoadmapTool(student.level, student.studiedTopics),
  };

  // Only pass recent messages to AI (context management)
  const recentMessages = messages.slice(-12);

  const result = await streamText({
    model: google("gemini-2.0-flash"),
    system: fullSystemPrompt,
    messages: recentMessages,
    tools,
    maxSteps: 5,
    temperature: 0.7,
  });

  // Return updated context in response headers
  const contextHeader = JSON.stringify({
    student: updatedContext.student,
    conversationSummary,
    messageCount: allHistory.length + 1,
  });

  const response = result.toDataStreamResponse();
  const headers = new Headers(response.headers);
  headers.set("X-Updated-Context", Buffer.from(contextHeader).toString("base64"));
  headers.set("Access-Control-Expose-Headers", "X-Updated-Context");

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
