
# AI Workplace Productivity Assistant

A modern SaaS dashboard with five AI-powered productivity tools, sidebar navigation, and editable AI outputs. Adapted to this project's stack (TanStack Start + Tailwind v4 + Lovable AI Gateway instead of Express + OpenAI).

## Stack adaptation

The spec lists React + Express + OpenAI. This project uses TanStack Start (React 19 + file-based routing). I'll keep the spec's UX, layout, prompts, and features 1:1, but:
- Routes go under `src/routes/` (TanStack), not `src/pages/`.
- AI calls go through **Lovable AI Gateway** (`google/gemini-3-flash-preview` by default) via a TanStack server function — no Express server, no user-supplied OpenAI key, no separate `server/` folder.
- Styling uses Tailwind v4 tokens defined in `src/styles.css` and shadcn components already in the project. The blue/slate SaaS palette from the spec becomes semantic tokens (no hardcoded hex in components).

## Routes

```
src/routes/
  __root.tsx              # Sidebar + Header shell, Outlet, AI disclaimer footer
  index.tsx               # Dashboard with 5 FeatureCards
  email.tsx               # Smart Email Generator
  notes.tsx               # Meeting Notes Summarizer
  planner.tsx             # AI Task Planner
  research.tsx            # AI Research Assistant
  chatbot.tsx             # AI Chatbot Interface
```

Each tool route has its own `head()` with unique title + description.

## Components

```
src/components/
  app-sidebar.tsx         # shadcn Sidebar with 5 nav items + Lucide icons
  feature-card.tsx        # Dashboard card (title, description, icon, link)
  output-editor.tsx       # Reusable editable textarea for AI outputs
  ai-disclaimer.tsx       # Yellow warning shown on every page
  tool-shell.tsx          # Shared layout: input panel + output panel + Generate button
```

## Backend (server function)

Single server function at `src/lib/ai.functions.ts`:

```ts
export const runAiPrompt = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => z.object({
    prompt: z.string().min(1),
    system: z.string().optional(),
    history: z.array(z.object({ role: z.enum(["user","assistant"]), content: z.string() })).optional(),
  }).parse(i))
  .handler(async ({ data }) => {
    // Lovable AI Gateway via @ai-sdk/openai-compatible
    // model: google/gemini-3-flash-preview
    // Surface 429 / 402 with clean error messages
  })
```

Each tool builds the structured prompt from the spec on the client, calls `runAiPrompt`, and pipes the result into `OutputEditor` (or chat bubbles for chatbot).

The chatbot route sends `history` for multi-turn context; messages are kept in component state (no persistence — matches spec).

## Tool screens (all use ToolShell + OutputEditor)

1. **Email Generator** — Purpose input, Recipient input, Tone select (Formal/Friendly/Persuasive). Uses spec's email prompt verbatim.
2. **Notes Summarizer** — Single textarea for notes. Output sections: Summary / Key Decisions / Action Items / Deadlines.
3. **Task Planner** — Tasks textarea, available hours number, daily/weekly toggle. Output: time-blocked schedule.
4. **Research Assistant** — Topic input. Output: Executive Summary / Key Insights / Trends / Recommendations.
5. **Chatbot** — Chat bubbles, auto-scroll to bottom, input + send. System prompt from spec. Markdown rendering for assistant messages.

All AI outputs render via `react-markdown` and remain editable in `OutputEditor` (chatbot excepted).

## Design

- Tailwind v4 `@theme` tokens in `src/styles.css`: primary blue, slate background/text, card surface, border — mapped via `@theme inline` so shadcn classes resolve.
- Sidebar: shadcn `Sidebar` with `collapsible="icon"`, `SidebarTrigger` in the header (always visible on mobile).
- Responsive grid on dashboard: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
- Card style: rounded-2xl, soft shadow, hover lift.
- AI disclaimer rendered once in `__root.tsx` footer so it appears on every page.

## Out of scope (not in spec)

- No auth, no database, no history persistence (chatbot history lives in component state only).
- No email sending, no calendar integration — outputs are editable text the user copies.

Ready to build on approval.
