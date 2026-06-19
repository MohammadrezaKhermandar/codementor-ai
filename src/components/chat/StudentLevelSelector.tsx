"use client";

import { StudentLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StudentLevelSelectorProps {
  level: StudentLevel;
  onChange: (level: StudentLevel) => void;
}

const levels: { value: StudentLevel; label: string; emoji: string; description: string }[] = [
  {
    value: "beginner",
    label: "Beginner",
    emoji: "🌱",
    description: "New to programming",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    emoji: "🚀",
    description: "Comfortable with basics",
  },
  {
    value: "advanced",
    label: "Advanced",
    emoji: "⚡",
    description: "Production experience",
  },
];

export function StudentLevelSelector({
  level,
  onChange,
}: StudentLevelSelectorProps) {
  return (
    <div className="flex gap-2">
      {levels.map((l) => (
        <button
          key={l.value}
          onClick={() => onChange(l.value)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
            level === l.value
              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300"
          )}
          title={l.description}
        >
          <span>{l.emoji}</span>
          <span>{l.label}</span>
        </button>
      ))}
    </div>
  );
}
