import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { runAiPrompt } from "@/lib/ai.functions";
import { ToolShell } from "@/components/tool-shell";
import { OutputEditor } from "@/components/output-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace" },
      { name: "description", content: "Get executive summaries, insights, and recommendations on any topic." },
      { property: "og:title", content: "AI Research Assistant — AI Workplace" },
      { property: "og:description", content: "AI-powered research briefs in seconds." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(runAiPrompt);
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a research topic.");
      return;
    }
    setLoading(true);
    try {
      const prompt = `Research the following topic:

${topic}

Provide:

- Executive Summary
- Key Insights
- Trends
- Recommendations`;
      const { text } = await run({ data: { prompt } });
      setOutput(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to research");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      title="AI Research Assistant"
      description="Enter a topic to get a structured research brief."
      icon={Search}
      inputs={
        <>
          <div className="grid gap-2">
            <Label htmlFor="topic">Research topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Artificial intelligence in HR"
              onKeyDown={(e) => e.key === "Enter" && generate()}
            />
          </div>
          <Button onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Research
          </Button>
        </>
      }
      output={<OutputEditor value={output} onChange={setOutput} placeholder="Research brief will appear here." />}
    />
  );
}
