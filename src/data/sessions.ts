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
  streaming?: boolean;
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
    title: "Capabilities Overview",
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
        content: `I sit in front of a fleet of specialized agents and route your requests to whichever ones have the right tools and context. Think of me as the dispatcher, not the worker.

## Where I'm most useful

- **Simulation planning** — sketching scenarios, reviewing parameter sweeps, debugging divergent runs
- **Asset ingestion** — tagging, deduping, flagging quality issues before they hit the catalog
- **Voice agent configuration** — tuning personas, safety rails, latency/cost tradeoffs
- **Data analysis** — pulling across runs, stitching telemetry, producing readable summaries

## How to get the best out of me

1. Give me **the goal**, not just the task. "I want to validate X" beats "Run Y."
2. Tell me **what you've already tried** — I won't re-suggest dead ends.
3. Paste **real output** (logs, stack traces, screenshots). Vague descriptions lead to vague answers.
4. When the work is done, **tell me what worked** so I can remember it for next time.

> If you're not sure where to start, tell me what you're looking at on your screen right now — we'll go from there.

Let me know what you'd like to begin with.`,
        timestamp: "12:36 am",
      },
      {
        id: "s1-m3",
        role: "user",
        content: "What's the fastest way to get a new simulation off the ground?",
        timestamp: "12:37 am",
      },
      {
        id: "s1-m4",
        role: "agent",
        content: `The fastest path is almost always: **start with a known-good template, then perturb.**

\`\`\`bash
vems sim init --template=pendulum-baseline
cd pendulum-baseline
vems sim run --steps=500
\`\`\`

This gives you a working run in under a minute. From there:

| Stage | What you change | Why |
|---|---|---|
| 1 | One parameter at a time | Isolate the effect |
| 2 | Sweep a small range (5–10 values) | See the shape of the response |
| 3 | Cross two parameters | Find interaction effects |
| 4 | Replace the model | Only once you trust the harness |

Skipping stage 1 is the single most common reason people lose a day to "why is this different?"`,
        timestamp: "12:39 am",
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
        content: `My simulation keeps panicking after a few hundred steps. Here's what I'm getting:

\`\`\`text
thread 'main' panicked at 'index out of bounds: the len is 64 but the index is 64', src/sim.rs:142:18
note: run with \`RUST_BACKTRACE=1\` environment variable to display a backtrace
\`\`\`

It works fine for the first ~200 steps, then dies. I've been staring at this for an hour.`,
        timestamp: "09:04 am",
      },
      {
        id: "s2-m2",
        role: "agent",
        content: `Classic off-by-one. The "works for a while, then dies" pattern is the tell — the index only reaches \`len\` once a condition drifts past it.

Paste the loop at \`sim.rs:142\` — I'll bet you have \`0..=len\` instead of \`0..len\`, or you're updating \`len\` mid-loop without re-checking.`,
        timestamp: "09:05 am",
      },
      {
        id: "s2-m3",
        role: "user",
        content: `Yeah here it is:

\`\`\`rust
let len = particles.len();
for i in 0..=len {
    let p = &mut particles[i];
    update(p, dt);
    if p.should_spawn() {
        particles.push(p.spawn_child());
    }
}
\`\`\``,
        timestamp: "09:06 am",
      },
      {
        id: "s2-m4",
        role: "agent",
        content: `Two bugs, both common:

1. \`0..=len\` walks one past the end. Should be \`0..len\`.
2. Mutably borrowing \`particles[i]\` while also pushing to \`particles\` is undefined behavior — the Vec can reallocate and invalidate your reference.

Rewrite it like this:

\`\`\`rust
let mut spawned = Vec::new();
for p in particles.iter_mut() {
    update(p, dt);
    if p.should_spawn() {
        spawned.push(p.spawn_child());
    }
}
particles.extend(spawned);
\`\`\`

\`iter_mut()\` kills the index-bounds problem entirely. Deferring the \`push\` into a scratch \`Vec\` avoids the aliasing issue — the extend happens after the immutable loop borrow ends.

**Performance note:** if \`spawn_child\` fires rarely, the scratch vec is essentially free. If it fires every frame, use \`Vec::with_capacity(particles.len() / 4)\` or similar to avoid reallocations.

Want me to open a PR with the fix?`,
        timestamp: "09:08 am",
      },
      {
        id: "s2-m5",
        role: "user",
        content: "Yes please. Attach the patch file too.",
        timestamp: "09:10 am",
      },
      {
        id: "s2-m6",
        role: "agent",
        content: `Done. PR **#482** opened against \`main\` with:

- \`src/sim.rs\` — the loop rewrite above
- \`src/sim.rs\` — new \`#[test] fn spawn_during_step_does_not_panic()\` that reproduces the old crash
- \`CHANGELOG.md\` — one-liner under "Fixed"

CI should turn green in ~4 minutes. The regression test was the important piece — without it this bug will absolutely come back in six months when someone "optimizes" the loop.`,
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
        content: "Can you review these renders and tag them for the catalog? Flag anything that needs rework before ingestion.",
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
        content: `Reviewed all three. Here's the breakdown:

| File | Suggested tags | Quality | Notes |
|---|---|---|---|
| lunar-01.png | \`terrain\`, \`lunar\`, \`daylight\`, \`mid-relief\` | ✅ Ship | Balanced exposure, good mid-tones |
| lunar-02.png | \`terrain\`, \`lunar\`, \`dusk\`, \`low-angle\` | ⚠ Review | Slight motion blur on the right ridge — intentional? |
| lunar-03.png | \`terrain\`, \`lunar\`, \`night\`, \`wide-shot\` | ❌ Rework | **Histogram crushed to the low end**; details lost below 8% luminance |

## Recommended fix for lunar-03

Either re-render with a lifted black point, or apply a **filmic tone map** in post:

\`\`\`python
import numpy as np

def filmic(x, shoulder=0.22, linear=0.30, toe=0.10):
    return ((x * (shoulder * x + linear)) /
            (x * (shoulder * x + linear + toe) + toe * 0.5))
\`\`\`

Apply in linear space, *before* the sRGB conversion. That lifts shadows without clipping highlights.

> For the catalog, we've agreed to reject anything below 12% mean luminance on the low quartile — lunar-03 currently sits at 7.4%. Easy fix, but worth doing.

Want me to run the tone map locally and swap the asset, or kick it back to the render team?`,
        timestamp: "04:48 pm",
      },
      {
        id: "s3-m3",
        role: "user",
        content: "Kick it back. Tag the other two and queue them.",
        timestamp: "04:51 pm",
      },
      {
        id: "s3-m4",
        role: "agent",
        content: `Done:

- **lunar-01** — queued, ingestion ID \`ING-7842\`
- **lunar-02** — queued with \`needs-review\` flag (motion blur)
- **lunar-03** — sent back to render team with notes above; Slack ping to \`@aria-moon\` and a card opened on the Render board

Turnaround estimate for lunar-03 is 1–2 days based on recent history.`,
        timestamp: "04:52 pm",
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
        content: "Write a short brief for our gradient system. Keep it opinionated — I don't want a list of options, I want a position.",
        timestamp: "Mon 03:10 pm",
      },
      {
        id: "s4-m2",
        role: "agent",
        content: `# Gradient System

Our brand mark uses a **single-family gradient**: shades of blue only. No purple. No pink. No teal. If it doesn't sit between \`sky-300\` and \`blue-700\`, it doesn't belong in the mark.

## The position

Multi-hue gradients signal consumer apps and crypto tokens. We're neither. We're infrastructure — and infrastructure earns trust by looking *consistent*, not *exciting*. A single-family gradient says "we know what we are."

## The stops

| Token | Hex | Role |
|---|---|---|
| \`sky-300\` | \`#7dd3fc\` | Highlight |
| \`sky-400\` | \`#38bdf8\` | Upper mid |
| \`blue-500\` | \`#3b82f6\` | Core |
| \`blue-700\` | \`#1d4ed8\` | Shadow |

Angle: **135°** (top-left to bottom-right). Always. Don't rotate per layout — it's a brand constant.

## When to go monochrome

Use \`text-primary\` (not the gradient) when:

- Inside dense UI — dropdowns, lists, toolbars, nav bars
- Over photography or video
- At sizes below **24px** (gradient bands become visible striping)
- On print or single-color surfaces
- When the logo appears next to another logo (co-branding)

## When to use the gradient

- Marketing pages, above-the-fold
- The splash / boot state of the product
- Launch announcements, OG images, investor materials
- Anywhere the logo is the hero element, not a navigation anchor

## What to never do

\`\`\`
❌ Rotate the angle per layout
❌ Change the stops for "dark mode" — use \`text-primary\` instead
❌ Add a third hue "for warmth"
❌ Apply the gradient to anything that isn't the mark itself
\`\`\`

> The gradient isn't a style — it's an identifier. Protect it the same way you protect the name.`,
        timestamp: "Mon 03:14 pm",
      },
      {
        id: "s4-m3",
        role: "user",
        content: "Good. Can you mock up what it looks like at 24px vs 16px so I can see the striping argument?",
        timestamp: "Mon 03:15 pm",
      },
      {
        id: "s4-m4",
        role: "agent",
        content: `Rendered both at 2× density and normalized to the same viewport. You can clearly see the banding in the 16px version — three distinct horizontal bands across the 'V' crossbar instead of a smooth transition.

The effect gets worse on LCDs without pixel-level dithering (most monitors). On mobile Retina it's less visible but still present.

**Takeaway:** the 24px floor isn't arbitrary — below it, the gradient becomes a liability.`,
        attachments: [
          {
            id: "s4-a1",
            name: "gradient-24-vs-16.png",
            kind: "image",
            url: "https://picsum.photos/seed/gradient-compare/640/360",
          },
        ],
        timestamp: "Mon 03:18 pm",
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
        content: "I need to split the `runs` table into `runs` and `run_artifacts`. How do I do this without downtime? We're at ~40M rows and growing about 2M/week.",
        timestamp: "Sun 11:02 am",
      },
      {
        id: "s5-m2",
        role: "agent",
        content: `At 40M rows and 2M/week growth, this is solidly in "zero-downtime or else" territory. A blocking migration would freeze writes for 10+ minutes — unacceptable.

## The four-step plan

### Step 1 — Additive migration

Create the new table, no reads or writes against it yet.

\`\`\`sql
CREATE TABLE run_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_run_artifacts_run_id ON run_artifacts (run_id);
CREATE INDEX idx_run_artifacts_kind ON run_artifacts (kind) WHERE kind != 'default';
\`\`\`

Run the backfill in **chunked batches** using \`LIMIT\` + \`ORDER BY id\`. Don't \`INSERT INTO ... SELECT\` the whole table — it'll hold a long transaction and block vacuum.

\`\`\`sql
-- Run this in a loop until 0 rows returned
INSERT INTO run_artifacts (run_id, kind, payload, created_at)
SELECT id, 'legacy', artifact_payload, created_at
FROM runs
WHERE artifact_payload IS NOT NULL
  AND id > $last_id
ORDER BY id
LIMIT 5000;
\`\`\`

**Expected duration:** ~4 hours at 5k/batch with 200ms gaps between batches.

### Step 2 — Dual-write

App writes to both tables behind a feature flag. New writes go to both; old data is backfilled.

\`\`\`ts
async function recordArtifact(runId: string, payload: Payload) {
  await db.runs.update(runId, { artifact_payload: payload });
  if (flags.dualWriteArtifacts) {
    await db.runArtifacts.insert({
      run_id: runId,
      kind: payload.kind,
      payload,
    });
  }
}
\`\`\`

Run dual-write for **at least 48 hours** before cutover. Compare row counts daily.

### Step 3 — Cutover read

Switch reads to \`run_artifacts\`. Leave dual-write on. Watch error rates and query latency for 24 hours.

If anything looks wrong, flip the read flag back — writes are still going to both places.

### Step 4 — Drop the old column

Only after you're confident. Usually wait a full week.

\`\`\`sql
ALTER TABLE runs DROP COLUMN artifact_payload;
VACUUM (FULL, ANALYZE) runs;  -- reclaim space
\`\`\`

Schedule the VACUUM FULL for low-traffic hours — it does take a lock.

## What could go wrong

1. **Backfill overwhelms replicas.** Throttle with \`pg_sleep(0.2)\` between batches. Watch replication lag.
2. **Dual-write transactions become hot.** If latency spikes during step 2, move the \`run_artifacts\` insert to an outbox and process async.
3. **Cutover reveals data drift.** Run a row-count and checksum comparison before flipping the read flag.

## Rollback

Rollback script attached. Works at any step 1–3. After step 4 you'll need to restore from backup — be paranoid.`,
        attachments: [
          {
            id: "s5-a1",
            name: "rollback-0042.sql",
            kind: "file",
            size: "1.4 KB",
          },
          {
            id: "s5-a2",
            name: "backfill-runner.ts",
            kind: "file",
            size: "3.8 KB",
          },
        ],
        timestamp: "Sun 11:09 am",
      },
      {
        id: "s5-m3",
        role: "user",
        content: "What if I have a concurrent write during backfill — does that race?",
        timestamp: "Sun 11:12 am",
      },
      {
        id: "s5-m4",
        role: "agent",
        content: `Only during step 1, and only if you skip the dual-write.

Here's the sequence:

1. Backfill reads row with id=X at T₀.
2. App writes to runs.artifact_payload at T₁.
3. Backfill inserts the T₀ value into run_artifacts.
4. run_artifacts now has a stale payload.

**Fix:** don't read from the app until step 3. Until then, \`run_artifacts\` is a shadow table — if it drifts, who cares. The source of truth is still \`runs.artifact_payload\`.

Once you turn on dual-write (step 2), new writes keep both in sync. Then you re-run the backfill one more time with \`ON CONFLICT (run_id) DO UPDATE\` to catch any rows the first pass missed. *Then* you cut reads over.

> The invariant to hold in your head: **you never read from a table you haven't been writing to for 24+ hours.**`,
        timestamp: "Sun 11:15 am",
      },
    ],
  },
  {
    id: "s6",
    title: "Voice Agent Personas",
    time: "4 days ago",
    preview:
      "Sketched three distinct TTS personas with vocabulary rules, pacing constraints, and sample dialogue.",
    messages: [
      {
        id: "s6-m1",
        role: "user",
        content: "I need three voice agent personas for the product. They should feel clearly different from each other — not just different voices saying the same thing.",
        timestamp: "Fri 10:20 am",
      },
      {
        id: "s6-m2",
        role: "agent",
        content: `Here's a set of three that sit at meaningfully different points in the design space:

## 1. Aurora — *The Senior Pilot*

**Vibe:** calm, technical, fractionally dry. Thinks before she speaks. Never excited.

**Vocabulary rules**
- Uses precise nouns over marketing words ("the solver" not "the engine")
- Never uses "absolutely," "amazing," "awesome"
- Will say "I don't know" rather than guess
- Occasionally admits uncertainty with "my read is..."

**Pacing:** slower than default. 0.95× speech rate, 140ms trailing pause after clauses.

**Sample**
> *"Your solver diverged at step 412. The state vector went non-finite in the second component. My read is a missing clamp on the velocity term — want me to walk through where it's most likely happening?"*

---

## 2. Nova — *The Eager Collaborator*

**Vibe:** warm, upbeat, curious. Leans forward. Asks good questions.

**Vocabulary rules**
- Uses "we" and "let's" generously
- Reflects the user's phrasing back ("you're trying to X, right?")
- Ends more turns with a question than a statement
- Allowed to use light enthusiasm ("nice," "oh, interesting") but not corporate hype

**Pacing:** default rate, 80ms trailing pauses.

**Sample**
> *"Oh, interesting — so the divergence only shows up past 400 steps? Let's check: is the timestep adaptive, or fixed? If it's adaptive, I'd look at the step-size controller first. What's the solver saying?"*

---

## 3. Echo — *The Minimalist*

**Vibe:** terse, factual, calm. Reports conclusions, not reasoning. Prefers bullet points over sentences.

**Vocabulary rules**
- Max 2 sentences per turn unless explicitly asked to expand
- No hedging ("I think," "it seems")
- Leads with the answer; details on request
- Never apologizes, never pads

**Pacing:** faster than default. 1.05× rate, no trailing pauses.

**Sample**
> *"Solver diverged. Velocity term unclamped. Fix: add \`clamp(v, -v_max, v_max)\` at sim.rs:88. Want the diff?"*

---

## Why these three

They form a triangle:

| | Warmth | Detail | Pace |
|---|---|---|---|
| Aurora | Medium | High | Slow |
| Nova | High | Medium | Medium |
| Echo | Low | Low | Fast |

A user who bounces off Aurora will click with Echo or Nova. If all three personas feel appealing to the same user, the design has collapsed — go back and push them further apart.

## What's missing

None of these are **playful** — no humor, no wordplay. Consider adding a fourth persona if you need a voice that can riff. But keep it to four, max. More than that and users can't remember who they picked.`,
        timestamp: "Fri 10:28 am",
      },
    ],
  },
  {
    id: "s7",
    title: "TypeScript Generics Deep Dive",
    time: "5 days ago",
    preview:
      "Walked through conditional types, inference with `infer`, and variadic tuple types with real examples.",
    messages: [
      {
        id: "s7-m1",
        role: "user",
        content: "I hit a wall on TypeScript generics. Can you explain conditional types and `infer` with some real examples? The docs are too abstract.",
        timestamp: "Thu 02:45 pm",
      },
      {
        id: "s7-m2",
        role: "agent",
        content: `Yeah, the docs explain the mechanics without the *why*. Let me do it backwards — start with a problem, then show the tool.

## Problem 1 — Unwrapping Promises

You have a function that might return \`Promise<User>\` or just \`User\`. You want a type that gives you \`User\` either way.

\`\`\`ts
type Awaited<T> = T extends Promise<infer U> ? U : T;

type A = Awaited<Promise<string>>;  // string
type B = Awaited<number>;            // number
type C = Awaited<Promise<Promise<boolean>>>; // Promise<boolean> — only unwraps one layer!
\`\`\`

The \`infer U\` declaration says: "if \`T\` matches the shape \`Promise<something>\`, capture that something as \`U\`." It's pattern matching at the type level.

> The built-in \`Awaited<T>\` recurses — our version doesn't. Writing the recursive version is a good exercise.

## Problem 2 — Function return types

You have a function and you want the type of its return value without importing it separately.

\`\`\`ts
type ReturnType<F> = F extends (...args: any[]) => infer R ? R : never;

function getUser() { return { id: "1", name: "Ada" }; }
type User = ReturnType<typeof getUser>; // { id: string, name: string }
\`\`\`

This is the actual definition of \`ReturnType\` from \`lib.es5.d.ts\`. Now you know.

## Problem 3 — Distributive conditional types

\`\`\`ts
type ToArray<T> = T extends any ? T[] : never;
type R = ToArray<string | number>; // string[] | number[]
\`\`\`

This is the weird one. When the type before \`extends\` is a bare generic parameter and it's a union, the conditional **distributes** over each member. This is usually what you want, but it can bite.

To *prevent* distribution, wrap in a tuple:

\`\`\`ts
type ToArrayNoDist<T> = [T] extends [any] ? T[] : never;
type S = ToArrayNoDist<string | number>; // (string | number)[]
\`\`\`

## Problem 4 — Variadic tuples (the fun one)

You want \`head\` and \`tail\` types.

\`\`\`ts
type Head<T extends unknown[]> = T extends [infer H, ...unknown[]] ? H : never;
type Tail<T extends unknown[]> = T extends [unknown, ...infer Rest] ? Rest : [];

type H = Head<[string, number, boolean]>;  // string
type T = Tail<[string, number, boolean]>;  // [number, boolean]
\`\`\`

Once you have these two, you can build surprisingly sophisticated things — including a typed \`zip\`, a \`curry\` that preserves parameter types, and a \`Pipe<Fns>\` that composes functions end-to-end.

## The rules in my head

1. \`infer\` is pattern match. The left side of \`extends\` is the pattern.
2. Distribution happens on **naked** generic parameters. \`T extends ...\` distributes; \`[T] extends [...]\` does not.
3. When you can't figure out what a conditional is doing, substitute concrete types manually. TypeScript's type system is a *program* — trace through it.
4. If you find yourself writing more than 3 nested conditionals, stop. There's usually a simpler approach, or the shape you're trying to model is wrong.

## What to read next

- *TypeScript Deep Dive* by Basarat — the generics chapter specifically
- The \`lib.es5.d.ts\` source — every utility type you use is built from these primitives
- \`type-fest\` on npm — read the source, not the docs; you'll learn a ton`,
        timestamp: "Thu 02:54 pm",
      },
      {
        id: "s7-m3",
        role: "user",
        content: "Can you write a typed `pipe` for me? Like `pipe(f, g, h)` where the output of each flows into the next and the final return type is correct.",
        timestamp: "Thu 02:56 pm",
      },
      {
        id: "s7-m4",
        role: "agent",
        content: `Here's the simplest version that works correctly:

\`\`\`ts
type UnaryFn<A, B> = (a: A) => B;

type Pipe<Fns extends UnaryFn<any, any>[]> =
  Fns extends [UnaryFn<infer A, infer B>]
    ? UnaryFn<A, B>
    : Fns extends [UnaryFn<infer A, infer B>, ...infer Rest]
      ? Rest extends [UnaryFn<B, any>, ...any[]]
        ? Rest extends UnaryFn<any, any>[]
          ? UnaryFn<A, ReturnType<Pipe<Rest>>>
          : never
        : never
      : never;

function pipe<Fns extends UnaryFn<any, any>[]>(
  ...fns: Fns & { 0: UnaryFn<any, any> }
): Pipe<Fns> {
  return ((x: any) => fns.reduce((acc, f) => f(acc), x)) as Pipe<Fns>;
}
\`\`\`

Usage:

\`\`\`ts
const double = (n: number) => n * 2;
const toStr = (n: number) => \`value=\${n}\`;
const exclaim = (s: string) => s + "!";

const f = pipe(double, toStr, exclaim);
//    ^? (a: number) => string

f(3); // "value=6!"
\`\`\`

The type-level trick: \`Pipe\` recursively peels off the first function, asserts its output matches the next function's input, and rebuilds the overall signature. If you ever pass functions whose types don't chain, TS will surface the error at the call site — not inside the generic — which is what you want.

**Limitations:**

- Doesn't handle the empty case (\`pipe()\`) — you probably don't want that anyway
- Doesn't support variadic functions (\`fn(a, b)\` → \`fn(a)(b)\`)

If you need both, look at \`fp-ts\` or \`effect\` — they've solved this comprehensively. For most codebases, the 20-line version above is plenty.`,
        timestamp: "Thu 03:02 pm",
      },
    ],
  },
  {
    id: "s8",
    title: "Incident Postmortem Draft",
    time: "6 days ago",
    preview:
      "Drafted a blameless postmortem for the 23-minute API outage on Tuesday — causes, timeline, action items.",
    messages: [
      {
        id: "s8-m1",
        role: "user",
        content: "Help me draft a postmortem for Tuesday's outage. 23 minutes, API 500s, root cause was a deploy that shipped a broken migration. Make it blameless and actually useful.",
        timestamp: "Wed 09:30 am",
      },
      {
        id: "s8-m2",
        role: "agent",
        content: `Here's a draft. Edit for tone but the skeleton is standard.

---

# Incident Postmortem — API Outage 2026-04-14

**Author:** [your name]
**Status:** Draft
**Severity:** SEV-2 (user-visible, partial outage, <1 hour)

## Summary

On Tuesday April 14 at 14:32 UTC, a deploy to the \`api\` service introduced a database migration that held an exclusive lock on the \`runs\` table for 23 minutes. All write traffic returned 500s during this window. Read traffic was partially degraded due to connection saturation. Full service was restored at 14:55 UTC after the migration was manually cancelled.

**User impact:** ~412 users saw failed API calls; ~18 had a workflow interrupted mid-execution. No data loss.

## Timeline (all times UTC)

| Time | Event |
|---|---|
| 14:28 | Deploy of \`api@v2026.04.14.1\` starts |
| 14:31 | Migration \`0042_normalize_runs.sql\` begins executing |
| 14:32 | First 500s appear; \`ALTER TABLE\` blocks on long-running read |
| 14:33 | PagerDuty fires on \`api_error_rate > 5%\` |
| 14:36 | On-call (@ana) acks page, begins investigation |
| 14:41 | Root cause identified: pg_stat_activity shows migration blocked |
| 14:48 | Decision to cancel migration and roll back deploy |
| 14:52 | Migration cancelled via \`pg_cancel_backend()\` |
| 14:55 | Services return healthy; rollback complete |
| 15:10 | Incident channel retrospective begins |

## Root cause

The migration ran \`ALTER TABLE runs ADD COLUMN ... NOT NULL DEFAULT ...\`, which in Postgres rewrites the entire table while holding an \`ACCESS EXCLUSIVE\` lock. At our current table size (~40M rows), this takes ~22 minutes. The migration was added without awareness of this Postgres behavior.

The migration was reviewed by a human before merge. The reviewer did not flag the lock risk, and our CI does not currently check for it.

## Why this wasn't caught

1. **No lock analysis in CI.** We don't run \`pg_stat_statements\` or any migration linter against staging.
2. **Staging data is too small.** The migration completed in ~200ms against our 5k-row staging DB. Production behavior was qualitatively different.
3. **The deploy system has no migration timeout.** A migration that blocks for an hour would just keep blocking.

## What went well

- Paging fired within 90 seconds of the first error
- On-call identified root cause in 5 minutes
- Decision to roll back was made decisively, not debated
- No data was lost or corrupted

## What went poorly

- No early warning; we saw the impact before we saw the cause
- Staging did not catch the regression
- \`ALTER TABLE\` took nearly the full lock window because of long-running queries competing for the lock

## Action items

| # | Owner | Item | Priority | Due |
|---|---|---|---|---|
| 1 | @ana | Add \`squawk\` migration linter to CI | P0 | 2026-04-28 |
| 2 | @jay | Document safe patterns for \`ADD COLUMN\` | P0 | 2026-04-25 |
| 3 | @sam | Deploy migration timeout (10 min default) | P1 | 2026-05-05 |
| 4 | @lee | Investigate pg_repack / online column add | P1 | 2026-05-12 |
| 5 | @ana | Staging DB size to ≥1% of prod | P2 | Q2 |

## Blameless commentary

The reviewer who approved the migration did so in good faith — the risk pattern here is not obvious to anyone who hasn't been bitten before. The fix is **tooling**, not **vigilance**. Every "we'll just be more careful next time" is an action item failure.

---

That's the shape. Fill in real names, tweak tone. The important parts: a factual timeline, a non-blamey root cause, and action items that address *tooling* — not "don't do that again."

A few things worth calling out as you edit:

- **Don't soften the "why wasn't this caught" section.** That's the most valuable part for the rest of the team.
- **Action items need owners and dates**, or they don't happen.
- **Skip the "lessons learned" section.** It turns into platitudes. If a lesson is real, it's an action item.`,
        timestamp: "Wed 09:42 am",
      },
    ],
  },
  {
    id: "s9",
    title: "Design System Color Audit",
    time: "1 week ago",
    preview:
      "Audited the existing 40+ color tokens, proposed consolidation to 12 semantic roles with dark-mode parity.",
    messages: [
      {
        id: "s9-m1",
        role: "user",
        content: "Our color system is a mess — 40+ tokens, overlapping, inconsistent dark mode. Can you audit and propose a consolidation? I want semantic tokens, not color names.",
        timestamp: "Apr 15 10:15 am",
      },
      {
        id: "s9-m2",
        role: "agent",
        content: `I went through the current \`tokens.json\`. Here's the state of things and what I'd replace it with.

## Current state (abbreviated)

\`\`\`
blue-50, blue-100, blue-200, blue-300, blue-400, blue-500,
blue-600, blue-700, blue-800, blue-900,
gray-50, gray-100, ..., gray-900,
red-500, red-600, red-700,
green-500, green-600,
yellow-400, yellow-500,
primary, primary-light, primary-dark,  // unclear relation to blue-*
brand, brand-muted,                     // duplicate of primary?
accent, accent-alt,                     // used inconsistently
surface, surface-raised, surface-sunken,
text, text-subtle, text-inverse, text-on-primary,
border, border-strong, divider,
...
\`\`\`

40+ tokens, and at least 8 pairs that are semantically identical but named differently. Half of them are used once.

## What I'd replace it with

12 semantic roles, each with a value per light and dark theme.

\`\`\`ts
const tokens = {
  // Surfaces
  background: { light: "#ffffff",  dark: "#0a0a0a" },
  card:       { light: "#ffffff",  dark: "#141414" },
  muted:      { light: "#f4f4f5",  dark: "#1f1f22" },

  // Foreground
  foreground:          { light: "#0a0a0a", dark: "#fafafa" },
  "muted-foreground":  { light: "#71717a", dark: "#a1a1aa" },

  // Brand
  primary:             { light: "#3b82f6", dark: "#60a5fa" },
  "primary-foreground":{ light: "#ffffff", dark: "#0a0a0a" },

  // Status
  destructive:             { light: "#ef4444", dark: "#dc2626" },
  "destructive-foreground":{ light: "#ffffff", dark: "#fafafa" },

  // Structure
  border: { light: "#e4e4e7", dark: "#27272a" },
  ring:   { light: "#3b82f6", dark: "#60a5fa" },
};
\`\`\`

That's it. 12 tokens instead of 40.

## The rules

1. **Semantic names only.** \`primary\`, not \`blue-500\`. Color hex values may change; semantic meaning shouldn't.
2. **Pair foregrounds with backgrounds.** If you have \`primary\`, you need \`primary-foreground\`. No guessing what text color to use.
3. **No color *scales* in the design system.** Scales belong in the raw palette layer, below the semantic layer. Designers pick from semantic tokens; the semantic layer picks from raw.
4. **Every token must have a light and dark value.** If there's no meaningful dark variant, it's a raw palette value, not a token.

## What gets deleted

| Old | Replace with |
|---|---|
| \`blue-50\` .. \`blue-900\` | Use \`primary\` + \`primary-foreground\`; for gradient bands, inline the hex |
| \`gray-*\` | Use \`muted\`, \`muted-foreground\`, \`border\` |
| \`brand\`, \`brand-muted\` | \`primary\`, \`primary-foreground\` |
| \`accent\`, \`accent-alt\` | *Delete entirely.* Accent colors should be per-product-surface, not global. |
| \`surface-raised\`, \`surface-sunken\` | Use shadow, not color. If you need the extra layer: \`popover\`. |
| \`text-on-primary\` | \`primary-foreground\` |

## Migration plan

1. Add the new tokens alongside the old ones (dual-token period).
2. Run a codemod to replace usages. Track coverage in CI.
3. After two releases with no regressions, delete the old tokens.

Expected duration: **3-4 weeks** with one designer and one engineer. The codemod is the bulk of the work.

## What this buys you

- New designers can learn the whole system in 10 minutes
- Dark mode parity is enforced by the shape of the system
- Theming (e.g. a customer-branded variant) is a 12-line config, not a 40-line override file
- shadcn/ui and most modern component libraries already use this exact shape, so you get drop-in compatibility

Want me to sketch the codemod, or the shadcn-compatible \`globals.css\` file next?`,
        timestamp: "Apr 15 10:27 am",
      },
      {
        id: "s9-m3",
        role: "user",
        content: "Sketch the globals.css. Also: why not expose a full color scale to designers? They'll say they need it.",
        timestamp: "Apr 15 10:30 am",
      },
      {
        id: "s9-m4",
        role: "agent",
        content: `Good question — here's the answer first, then the CSS.

## Why not expose full color scales

Designers *think* they need scales because that's how Figma libraries ship. But in practice, every time a designer reaches past the semantic layer, you get a snowflake — a component that doesn't respond to theming, a dark-mode bug, a brand-refresh migration that takes six weeks instead of six days.

The discipline is: **if the design can't be expressed in semantic tokens, the system is incomplete.** That's a signal to add a new semantic role, not to open up the raw scale.

Exceptions: illustrations, marketing pages, and brand moments (splash screens, onboarding hero). Those can reach into the raw palette because they're not part of the product UI.

## globals.css

\`\`\`css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 4%;

    --card: 0 0% 100%;
    --card-foreground: 240 10% 4%;

    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 4%;

    --primary: 217 91% 60%;
    --primary-foreground: 0 0% 100%;

    --muted: 240 5% 96%;
    --muted-foreground: 240 4% 46%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    --border: 240 6% 90%;
    --ring: 217 91% 60%;

    --radius: 0.625rem;
  }

  .dark {
    --background: 0 0% 4%;
    --foreground: 0 0% 98%;

    --card: 0 0% 8%;
    --card-foreground: 0 0% 98%;

    --popover: 0 0% 8%;
    --popover-foreground: 0 0% 98%;

    --primary: 217 91% 70%;
    --primary-foreground: 240 10% 4%;

    --muted: 240 4% 12%;
    --muted-foreground: 240 5% 65%;

    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 98%;

    --border: 240 4% 15%;
    --ring: 217 91% 70%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}
\`\`\`

The HSL format is so you can tweak lightness per theme without re-specifying hue — makes dark mode feel less hand-crafted.

Drop this into \`src/styles/globals.css\`, wire it to your Tailwind config, and every existing shadcn component will just work.`,
        timestamp: "Apr 15 10:37 am",
      },
    ],
  },
];
