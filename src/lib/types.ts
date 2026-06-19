export type StudentLevel = "beginner" | "intermediate" | "advanced";

export interface StudentContext {
  level: StudentLevel;
  favoriteTechnologies: string[];
  currentRoadmap: string | null;
  studiedTopics: string[];
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface AppContext {
  student: StudentContext;
  conversationHistory: ConversationMessage[];
  conversationSummary: string | null;
}

export const DEFAULT_STUDENT_CONTEXT: StudentContext = {
  level: "beginner",
  favoriteTechnologies: [],
  currentRoadmap: null,
  studiedTopics: [],
};

export const DEFAULT_APP_CONTEXT: AppContext = {
  student: DEFAULT_STUDENT_CONTEXT,
  conversationHistory: [],
  conversationSummary: null,
};
