import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, Calendar, Search, MessageSquare, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace" },
      {
        name: "description",
        content: "Your AI-powered workplace productivity dashboard with five built-in tools.",
      },
      { property: "og:title", content: "Dashboard — AI Workplace" },
      {
        property: "og:description",
        content: "Five AI tools to automate emails, meetings, planning, research, and chat.",
      },
    ],
  }),
  component: Dashboard,
});

const features = [
  {
    title: "Email Generator",
    description: "Draft professional emails in any tone — formal, friendly, or persuasive.",
    icon: Mail,
    to: "/email" as const,
  },
  {
    title: "Meeting Summarizer",
    description: "Turn raw meeting notes into summaries, decisions, action items, and deadlines.",
    icon: FileText,
    to: "/notes" as const,
  },
  {
    title: "Task Planner",
    description: "Get a prioritized, time-blocked schedule based on your tasks and hours.",
    icon: Calendar,
    to: "/planner" as const,
  },
  {
    title: "Research Assistant",
    description: "Executive summary, key insights, trends, and recommendations on any topic.",
    icon: Search,
    to: "/research" as const,
  },
  {
    title: "AI Chatbot",
    description: "Conversational assistant for emails, scheduling, and productivity advice.",
    icon: MessageSquare,
    to: "/chatbot" as const,
  },
];

function Dashboard() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-muted-foreground">
          Pick a tool to get started. All outputs are editable before you use them.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.title}
            to={f.to}
            className="group flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
              Open <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
