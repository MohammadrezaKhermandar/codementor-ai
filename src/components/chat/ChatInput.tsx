"use client";

import { useRef, KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  placeholder?: string;
}

const QUICK_PROMPTS = [
  { label: "📝 Quiz", prompt: "Generate a quiz about React hooks" },
  { label: "💻 Code", prompt: "Generate a FastAPI CRUD example" },
  { label: "🗺️ Roadmap", prompt: "Create a roadmap for becoming a Backend Developer" },
  { label: "🔍 Review", prompt: "Review this repository: https://github.com/vercel/next.js" },
];

export function ChatInput({
  input,
  onInputChange,
  onSubmit,
  isLoading,
  placeholder,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  };

  const handleQuickPrompt = (prompt: string) => {
    const syntheticEvent = {
      target: { value: prompt },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onInputChange(syntheticEvent);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  return (
    <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
      {/* Quick prompt suggestions */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
        {QUICK_PROMPTS.map((qp) => (
          <button
            key={qp.label}
            onClick={() => handleQuickPrompt(qp.prompt)}
            disabled={isLoading}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-gray-50 dark:bg-gray-800"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <form onSubmit={onSubmit} className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={
              placeholder ||
              "Ask me anything about programming... (Enter to send, Shift+Enter for new line)"
            }
            disabled={isLoading}
            rows={1}
            className={cn(
              "w-full resize-none rounded-xl border border-gray-200 dark:border-gray-700",
              "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
              "px-4 py-3 text-sm leading-relaxed",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              "transition-all duration-200 max-h-40",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
            "bg-indigo-600 text-white shadow-sm",
            "hover:bg-indigo-700 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          )}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
        AI-powered by Google Gemini • Responses may not always be accurate
      </p>
    </div>
  );
}
