const titleStarters = [
  "Exploring",
  "Draft —",
  "Quick note:",
  "Working on",
  "Untitled —",
  "Session —",
];

export function makeSessionTitle(firstMessage: string): string {
  const trimmed = firstMessage.trim().replace(/\s+/g, " ");
  if (!trimmed) return "New Session";
  const words = trimmed.split(" ").slice(0, 6).join(" ");
  const starter = titleStarters[Math.floor(Math.random() * titleStarters.length)];
  const truncated = words.length > 40 ? words.slice(0, 40) + "…" : words;
  return `${starter} ${truncated}`;
}

const replies: string[] = [
  `Got it. Here's how I'd approach this:

1. **Break it down** — split the problem into smaller independent pieces.
2. **Validate assumptions** — check that each piece behaves the way you expect.
3. **Iterate** — ship the smallest useful version and refine.

Want me to dig into any of these?`,
  `A few thoughts:

- This pattern works well when the data is append-only.
- If you need edits, consider a soft-delete with a \`tombstone\` column instead.
- For query performance, add an index on \`created_at\` early.

\`\`\`sql
CREATE INDEX idx_events_created_at ON events (created_at DESC);
\`\`\`

Let me know if you want me to sketch the full schema.`,
  `Here's a minimal TypeScript version:

\`\`\`ts
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  wait: number,
): T {
  let t: ReturnType<typeof setTimeout> | null = null;
  return ((...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  }) as T;
}
\`\`\`

This is enough for UI input handlers. For heavier use (scroll, resize), reach for \`requestAnimationFrame\` instead.`,
  `Short answer: **yes, but with a caveat**.

The approach works for single-tenant deployments. For multi-tenant, you'll want to scope the cache key by \`tenant_id\` — otherwise you risk bleed-over between workspaces.

> Cache invalidation is hard. Scope it narrowly and your life gets easier.`,
  `Here's a comparison of the three options:

| Option | Latency | Complexity | Cost |
|---|---|---|---|
| Polling | High | Low | Low |
| Webhooks | Low | Medium | Low |
| Streaming | Lowest | High | Medium |

For your use case, **webhooks** are the sweet spot — low latency without the operational burden of a streaming pipeline.`,
  `Quick sketch:

- Start with the happy path — get one message end-to-end.
- Then add error handling at the boundary (network, parsing, auth).
- Finally, instrument with metrics so you can see regressions early.

Don't optimize until you have real traffic to measure against.`,
  `I'd recommend the following structure:

\`\`\`
src/
  features/
    run/
      page.tsx
      markdown.tsx
      fake-ai.ts
  data/
    sessions.ts
\`\`\`

Keep feature-specific files co-located, and only promote to \`shared/\` once something is reused by at least two features.`,
];

export function generateReply(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  if (msg.includes("sql") || msg.includes("database") || msg.includes("schema")) {
    return replies[1];
  }
  if (msg.includes("typescript") || msg.includes("debounce") || msg.includes("function")) {
    return replies[2];
  }
  if (msg.includes("cache") || msg.includes("tenant")) {
    return replies[3];
  }
  if (msg.includes("compare") || msg.includes("vs") || msg.includes("options")) {
    return replies[4];
  }
  if (msg.includes("structure") || msg.includes("organize") || msg.includes("folder")) {
    return replies[6];
  }
  return replies[Math.floor(Math.random() * replies.length)];
}

export function formatTime(date: Date = new Date()): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const h12 = hours % 12 || 12;
  const ampm = hours < 12 ? "am" : "pm";
  return `${h12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}
