import { NextRequest, NextResponse } from "next/server";
import { AppContext, DEFAULT_APP_CONTEXT } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { context }: { context: Partial<AppContext> } = body;

  const merged: AppContext = {
    ...DEFAULT_APP_CONTEXT,
    ...context,
    student: {
      ...DEFAULT_APP_CONTEXT.student,
      ...(context.student || {}),
    },
  };

  return NextResponse.json({ context: merged });
}
