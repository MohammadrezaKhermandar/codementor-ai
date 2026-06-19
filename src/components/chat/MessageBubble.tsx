"use client";

import { Message } from "ai";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Bot, User, Wrench } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

function ToolCallIndicator({ toolName }: { toolName: string }) {
  const toolLabels: Record<string, { label: string; emoji: string }> = {
    generate_quiz: { label: "Generating Quiz", emoji: "📝" },
    generate_code: { label: "Generating Code", emoji: "💻" },
    review_github: { label: "Reviewing Repository", emoji: "🔍" },
    create_roadmap: { label: "Creating Roadmap", emoji: "🗺️" },
  };

  const info = toolLabels[toolName] || { label: toolName, emoji: "🔧" };

  return (
    <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900 w-fit">
      <Wrench className="w-3 h-3 animate-spin" />
      <span>
        {info.emoji} {info.label}...
      </span>
    </div>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const toolInvocations = message.toolInvocations || [];

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3 group",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm",
          isUser
            ? "bg-gradient-to-br from-indigo-500 to-purple-600"
            : "bg-gradient-to-br from-emerald-500 to-teal-600"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex flex-col gap-2 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* Tool invocations */}
        {toolInvocations.map((invocation, i) => (
          <ToolCallIndicator key={i} toolName={invocation.toolName} />
        ))}

        {/* Message content */}
        {message.content && (
          <div
            className={cn(
              "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
              isUser
                ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-sm"
                : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-sm"
            )}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-pre:my-2 prose-ul:my-1 prose-li:my-0.5">
                <ReactMarkdown
                  components={{
                    code(props) {
                      const { className, children, ...rest } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      const isInline = !match;
                      return isInline ? (
                        <code
                          className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs font-mono"
                          {...rest}
                        >
                          {children}
                        </code>
                      ) : (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg text-xs !my-2"
                          customStyle={{ fontSize: "0.75rem" }}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      );
                    },
                    h1: ({ children }) => (
                      <h1 className="text-lg font-bold mt-3 mb-1">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base font-semibold mt-2 mb-1">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-semibold mt-2 mb-1">{children}</h3>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-4 space-y-0.5">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-4 space-y-0.5">{children}</ol>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-indigo-400 pl-3 italic text-gray-500 dark:text-gray-400 my-2">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
