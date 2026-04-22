export type Attachment = {
  id: string;
  name: string;
  kind: "image" | "file";
  url?: string;
  size?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "agent";
  content: string;
  attachments?: Attachment[];
  timestamp: string;
};

export type Session = {
  id: string;
  title: string;
  time: string;
  preview: string;
  messages: ChatMessage[];
};

export const sessions: Session[] = [
  {
    id: "s1",
    title: "Untitled Session",
    time: "Today 12:36 am",
    preview:
      "I can assist you by routing your questions and tasks to specialized agents who have the necessary tools and...",
    messages: [
      {
        id: "s1-m1",
        role: "user",
        content: "What can you help me with today?",
        timestamp: "12:34 am",
      },
      {
        id: "s1-m2",
        role: "agent",
        content:
          "I can assist you by **routing your questions and tasks** to specialized agents who have the necessary tools and context.\n\nFor example:\n\n- Simulation planning and review\n- Asset ingestion and tagging\n- Voice agent configuration\n- Data analysis across runs\n\nLet me know what you'd like to start with.",
        timestamp: "12:36 am",
      },
    ],
  },
  {
    id: "s2",
    title: "Rust Simulation Crash",
    time: "Today 09:12 am",
    preview:
      "The simulator panicked in `sim::step` — here's the stack trace and the patch that fixes the out-of-bounds read.",
    messages: [
      {
        id: "s2-m1",
        role: "user",
        content:
          "My simulation keeps panicking. Here's the error:\n\n```text\nthread 'main' panicked at 'index out of bounds: the len is 64 but the index is 64', src/sim.rs:142:18\n```",
        timestamp: "09:04 am",
      },
      {
        id: "s2-m2",
        role: "agent",
        content:
          "Classic off-by-one. The loop in `sim::step` iterates `0..=len` instead of `0..len`.\n\n```rust\n// before\nfor i in 0..=particles.len() {\n    update(&mut particles[i]);\n}\n\n// after\nfor particle in particles.iter_mut() {\n    update(particle);\n}\n```\n\nUsing `iter_mut()` avoids the manual bound entirely. Want me to open a PR?",
        timestamp: "09:06 am",
      },
      {
        id: "s2-m3",
        role: "user",
        content: "Yes, please. Attach the patch file too.",
        timestamp: "09:08 am",
      },
      {
        id: "s2-m4",
        role: "agent",
        content:
          "Patch drafted and PR **#482** opened against `main`.",
        attachments: [
          {
            id: "s2-a1",
            name: "fix-sim-bounds.patch",
            kind: "file",
            size: "2.1 KB",
          },
        ],
        timestamp: "09:12 am",
      },
    ],
  },
  {
    id: "s3",
    title: "Asset Review — Lunar Terrain",
    time: "Yesterday 04:48 pm",
    preview:
      "Uploaded three terrain renders for tagging. Agent flagged one as low-contrast and suggested a tone-map tweak.",
    messages: [
      {
        id: "s3-m1",
        role: "user",
        content: "Can you review these renders and tag them for the catalog?",
        attachments: [
          {
            id: "s3-a1",
            name: "lunar-01.png",
            kind: "image",
            url: "https://picsum.photos/seed/lunar-01/640/360",
          },
          {
            id: "s3-a2",
            name: "lunar-02.png",
            kind: "image",
            url: "https://picsum.photos/seed/lunar-02/640/360",
          },
          {
            id: "s3-a3",
            name: "lunar-03.png",
            kind: "image",
            url: "https://picsum.photos/seed/lunar-03/640/360",
          },
        ],
        timestamp: "04:30 pm",
      },
      {
        id: "s3-m2",
        role: "agent",
        content:
          "Tagged and queued for ingestion:\n\n| File | Tags | Notes |\n|---|---|---|\n| lunar-01.png | `terrain`, `lunar`, `daylight` | Balanced exposure |\n| lunar-02.png | `terrain`, `lunar`, `dusk` | Slight motion blur |\n| lunar-03.png | `terrain`, `lunar`, `night` | **Low contrast — recommend tone map** |\n\nI can apply a filmic tone map to `lunar-03` if you'd like.",
        timestamp: "04:48 pm",
      },
    ],
  },
  {
    id: "s4",
    title: "Gradient System Brief",
    time: "2 days ago",
    preview:
      "Drafted a palette for the brand mark: sky → blue → deep-blue, plus guidance on when to go monochrome.",
    messages: [
      {
        id: "s4-m1",
        role: "user",
        content:
          "Write a short brief for our gradient system. Keep it opinionated.",
        timestamp: "Mon 03:10 pm",
      },
      {
        id: "s4-m2",
        role: "agent",
        content:
          "## Gradient System\n\nOur brand mark uses a **single-family gradient** — shades of blue only. No purple, no pink.\n\n### Stops\n\n1. `sky-300` — `#7dd3fc`\n2. `sky-400` — `#38bdf8`\n3. `blue-500` — `#3b82f6`\n4. `blue-700` — `#1d4ed8`\n\n### When to go monochrome\n\n- Inside dense UI (dropdowns, lists, toolbars)\n- Over photography\n- At sizes below 24px\n\n> Use `text-primary` in product surfaces. Reserve the gradient for marketing and the splash state.",
        timestamp: "Mon 03:12 pm",
      },
    ],
  },
  {
    id: "s5",
    title: "Postgres Migration Plan",
    time: "3 days ago",
    preview:
      "Four-step zero-downtime migration for the `runs` table, with a rollback SQL file attached.",
    messages: [
      {
        id: "s5-m1",
        role: "user",
        content:
          "I need to split the `runs` table into `runs` and `run_artifacts`. How do I do this without downtime?",
        timestamp: "Sun 11:02 am",
      },
      {
        id: "s5-m2",
        role: "agent",
        content:
          "Here's the four-step plan:\n\n1. **Additive migration** — create `run_artifacts`, backfill in a background job.\n2. **Dual-write** — app writes to both tables behind a flag.\n3. **Cutover read** — switch reads to `run_artifacts` once backfill is verified.\n4. **Drop columns** — remove the old columns from `runs` in a follow-up release.\n\n```sql\nCREATE TABLE run_artifacts (\n  id UUID PRIMARY KEY,\n  run_id UUID REFERENCES runs(id) ON DELETE CASCADE,\n  kind TEXT NOT NULL,\n  payload JSONB NOT NULL,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\nCREATE INDEX ON run_artifacts (run_id);\n```\n\nRollback script attached in case step 3 regresses.",
        attachments: [
          {
            id: "s5-a1",
            name: "rollback-0042.sql",
            kind: "file",
            size: "1.4 KB",
          },
        ],
        timestamp: "Sun 11:09 am",
      },
    ],
  },
];
