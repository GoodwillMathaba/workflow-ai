import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { runAiPrompt } from "@/lib/ai.functions";
import { ToolShell } from "@/components/tool-shell";
import { OutputEditor } from "@/components/output-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace" },
      { name: "description", content: "Get a prioritized, time-blocked schedule for your tasks." },
      { property: "og:title", content: "AI Task Planner — AI Workplace" },
      { property: "og:description", content: "Plan your day or week with AI-generated time blocks." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const run = useServerFn(runAiPrompt);
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("8");
  const [view, setView] = useState("Daily");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!tasks.trim()) {
      toast.error("Please list your tasks.");
      return;
    }
    setLoading(true);
    try {
      const prompt = `Create a productivity schedule (${view} view).

Tasks:
${tasks}

Hours Available:
${hours}

Generate:
- Prioritized tasks
- Recommended order
- Time blocks with start and end times`;
      const { text } = await run({ data: { prompt } });
      setOutput(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      title="AI Task Planner"
      description="List your tasks and available hours to get an organized schedule."
      icon={Calendar}
      inputs={
        <>
          <div className="grid gap-2">
            <Label htmlFor="tasks">Tasks (one per line)</Label>
            <Textarea
              id="tasks"
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={"Write Q3 report\nReview client emails\nPrep tomorrow's standup"}
              rows={6}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="hours">Hours available</Label>
              <Input
                id="hours"
                type="number"
                min={1}
                max={24}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>View</Label>
              <Select value={view} onValueChange={setView}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate plan
          </Button>
        </>
      }
      output={<OutputEditor value={output} onChange={setOutput} placeholder="Your schedule will appear here." />}
    />
  );
}
