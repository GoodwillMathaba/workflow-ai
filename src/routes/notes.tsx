import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { runAiPrompt } from "@/lib/ai.functions";
import { ToolShell } from "@/components/tool-shell";
import { OutputEditor } from "@/components/output-editor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace" },
      { name: "description", content: "Turn raw meeting notes into clear summaries and action items." },
      { property: "og:title", content: "Meeting Notes Summarizer — AI Workplace" },
      { property: "og:description", content: "Extract decisions, action items, and deadlines from meeting notes." },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const run = useServerFn(runAiPrompt);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!notes.trim()) {
      toast.error("Please paste meeting notes.");
      return;
    }
    setLoading(true);
    try {
      const prompt = `Summarize the meeting notes.

Provide:

1. Summary
2. Key Decisions
3. Action Items
4. Deadlines

Meeting Notes:
${notes}`;
      const { text } = await run({ data: { prompt } });
      setOutput(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      title="Meeting Notes Summarizer"
      description="Paste your notes and get a structured summary."
      icon={FileText}
      inputs={
        <>
          <div className="grid flex-1 gap-2">
            <Label htmlFor="notes">Meeting notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your raw meeting notes here..."
              className="min-h-[280px] flex-1"
            />
          </div>
          <Button onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Summarize
          </Button>
        </>
      }
      output={<OutputEditor value={output} onChange={setOutput} placeholder="Structured summary will appear here." />}
    />
  );
}
