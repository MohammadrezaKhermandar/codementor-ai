"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState, useCallback } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { StudentLevelSelector } from "./StudentLevelSelector";
import { ContextPanel } from "./ContextPanel";
import { AppContext, DEFAULT_APP_CONTEXT, StudentLevel } from "@/lib/types";
import { Bot, RotateCcw, SidebarOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const WELCOME_LINES = [
  { type: "h1", text: "👋 خوش اومدی به CodeMentor AI!" },
  { type: "gap" },
  { type: "p", text: "من دستیار هوشمند آموزش برنامه‌نویسی هستم. می‌تونی به فارسی یا انگلیسی باهام صحبت کنی — هر زبانی بنویسی، همون زبانی جواب می‌دم." },
  { type: "gap" },
  { type: "bold", text: "🛠️ ابزارهای من:" },
  { type: "item", text: "📝 کوییز ساز — تست دانش از هر موضوع برنامه‌نویسی" },
  { type: "item", text: "💻 کد ساز — مثال کد آموزشی با توضیح کامل" },
  { type: "item", text: "🔍 بررسی GitHub — بازخورد حرفه‌ای روی پروژه‌هات" },
  { type: "item", text: "🗺️ مسیر یادگیری — برنامه شخصی‌سازی شده برای رسیدن به هدفت" },
  { type: "gap" },
  { type: "bold", text: "💡 نمونه سوال‌ها:" },
  { type: "item", text: "«یه کوییز از React Context API بساز»" },
  { type: "item", text: "«یه مثال CRUD با FastAPI بنویس»" },
  { type: "item", text: "«این ریپو رو بررسی کن: https://github.com/vercel/next.js»" },
  { type: "item", text: "«مسیر یادگیری Backend Developer رو برام بساز»" },
  { type: "gap" },
  { type: "p", text: "سطح خودت رو از دکمه‌های بالا انتخاب کن، بعد هر سوالی داری بپرس! 🚀" },
];

export default function ChatInterface() {
  const [appContext, setAppContext] = useState<AppContext>(DEFAULT_APP_CONTEXT);
  const [showContextPanel, setShowContextPanel] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [hasSummary, setHasSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } =
    useChat({
      api: "/api/chat",
      body: {
        context: appContext,
      },
      onResponse: (response: Response) => {
        const contextHeader = response.headers.get("X-Updated-Context");
        if (contextHeader) {
          try {
            const decoded = JSON.parse(
              Buffer.from(contextHeader, "base64").toString("utf-8")
            );
            setAppContext((prev) => ({
              ...prev,
              student: decoded.student || prev.student,
              conversationSummary: decoded.conversationSummary || prev.conversationSummary,
            }));
            setMessageCount(decoded.messageCount || 0);
            setHasSummary(!!decoded.conversationSummary);
          } catch {
            // ignore
          }
        }
      },
    });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleLevelChange = (level: StudentLevel) => {
    setAppContext((prev) => ({
      ...prev,
      student: { ...prev.student, level },
    }));
  };

  const handleReset = () => {
    setMessages([]);
    setAppContext(DEFAULT_APP_CONTEXT);
    setMessageCount(0);
    setHasSummary(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                CodeMentor AI
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Intelligent Programming Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StudentLevelSelector
              level={appContext.student.level}
              onChange={handleLevelChange}
            />
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => setShowContextPanel(!showContextPanel)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  showContextPanel
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                )}
                title="Toggle context panel"
              >
                <SidebarOpen className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4 py-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg mb-6">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                <div className="space-y-1">
                  {WELCOME_LINES.map((line, i) => {
                    if (line.type === "h1") return <h1 key={i} className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{line.text}</h1>;
                    if (line.type === "gap") return <div key={i} className="h-2" />;
                    if (line.type === "bold") return <p key={i} className="font-semibold text-gray-800 dark:text-gray-200 mt-1">{line.text}</p>;
                    if (line.type === "item") return <p key={i} className="text-sm text-gray-600 dark:text-gray-400 pl-2">• {line.text}</p>;
                    return <p key={i} className="text-sm text-gray-600 dark:text-gray-400">{line.text}</p>;
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-1">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center h-5">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput
          input={input}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>

      {/* Context Panel */}
      {showContextPanel && (
        <ContextPanel
          student={appContext.student}
          messageCount={messageCount}
          hasSummary={hasSummary}
          onClose={() => setShowContextPanel(false)}
        />
      )}
    </div>
  );
}
