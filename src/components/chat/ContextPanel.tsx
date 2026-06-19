"use client";

import { StudentContext } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Code2, Map, Tag, X } from "lucide-react";

interface ContextPanelProps {
  student: StudentContext;
  messageCount: number;
  hasSummary: boolean;
  onClose: () => void;
}

export function ContextPanel({
  student,
  messageCount,
  hasSummary,
  onClose,
}: ContextPanelProps) {
  return (
    <div className="w-72 flex-shrink-0 border-l border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Student Context
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Level */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            <BookOpen className="w-3 h-3" />
            Student Level
          </div>
          <Badge
            variant={
              student.level === "beginner"
                ? "success"
                : student.level === "intermediate"
                ? "warning"
                : "default"
            }
            className="capitalize"
          >
            {student.level === "beginner"
              ? "🌱"
              : student.level === "intermediate"
              ? "🚀"
              : "⚡"}{" "}
            {student.level}
          </Badge>
        </div>

        {/* Technologies */}
        {student.favoriteTechnologies.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <Code2 className="w-3 h-3" />
              Technologies
            </div>
            <div className="flex flex-wrap gap-1">
              {student.favoriteTechnologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="capitalize">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Current Roadmap */}
        {student.currentRoadmap && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <Map className="w-3 h-3" />
              Current Roadmap
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
              {student.currentRoadmap}
            </p>
          </div>
        )}

        {/* Studied Topics */}
        {student.studiedTopics.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <Tag className="w-3 h-3" />
              Studied Topics
            </div>
            <div className="flex flex-wrap gap-1">
              {student.studiedTopics.map((topic) => (
                <Badge key={topic} variant="secondary" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Conversation Stats */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💬 Messages: {messageCount}
          </p>
          {hasSummary && (
            <p className="text-xs text-indigo-600 dark:text-indigo-400">
              ✨ Conversation summarized
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
