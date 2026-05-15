"use client";

import { Agentation as AgentationToolbar } from "agentation";

export function AgentationFeedback() {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <AgentationToolbar
      endpoint="http://localhost:4747"
      webhookUrl="/api/agentation"
    />
  );
}
