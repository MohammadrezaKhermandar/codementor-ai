import { ConversationMessage } from "@/lib/types";

const SUMMARY_THRESHOLD = 10;
const MAX_HISTORY_WITHOUT_SUMMARY = 20;

export function shouldSummarize(messages: ConversationMessage[]): boolean {
  return messages.length >= SUMMARY_THRESHOLD;
}

export function shouldTruncate(messages: ConversationMessage[]): boolean {
  return messages.length >= MAX_HISTORY_WITHOUT_SUMMARY;
}

export function buildSummaryPrompt(messages: ConversationMessage[]): string {
  const conversation = messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n\n");

  return `Summarize this programming tutoring conversation in 3-5 concise bullet points.
Capture: key topics discussed, concepts explained, tools/frameworks mentioned, problems solved, and student's current understanding level.
Be specific - include actual technology names and concepts.

Conversation:
${conversation}

Provide ONLY the bullet points, no intro or outro.`;
}

export function buildContextWithSummary(
  summary: string | null,
  recentMessages: ConversationMessage[]
): string {
  if (!summary) return "";

  const recentContext = recentMessages
    .slice(-6)
    .map((m) => `${m.role}: ${m.content.slice(0, 500)}`)
    .join("\n");

  return `## Previous Conversation Summary:
${summary}

## Recent Messages:
${recentContext}`;
}

export function getMessagesForContext(
  messages: ConversationMessage[],
  hasSummary: boolean
): ConversationMessage[] {
  if (hasSummary) {
    // With summary, keep only recent 6 messages
    return messages.slice(-6);
  }
  // Without summary, keep last 10
  return messages.slice(-10);
}
