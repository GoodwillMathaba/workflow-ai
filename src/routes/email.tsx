import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace" },
      { name: "description", content: "Generate professional emails in seconds with AI." },
      { property: "og:title", content: "Smart Email Generator — AI Workplace" },
      { property: "og:description", content: "Draft formal, friendly, or persuasive emails with AI." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(runAiPrompt);
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!purpose.trim()) {
      toast.error("Please describe the email purpose.");
      return;
    }
    setLoading(true);
    try {
      const prompt = `Generate a professional email.

Purpose: ${purpose}
Recipient: ${recipient || "Not specified"}
Tone: ${tone}

Write a complete email with:
- Subject line
- Greeting
- Body
- Professional closing`;
      const { text } = await run({ data: { prompt } });
      setOutput(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      title="Smart Email Generator"
      description="Describe the purpose, choose a tone, and get a complete draft."
      icon={Mail}
      inputs={
        <>
          <div className="grid gap-2">
            <Label htmlFor="purpose">Email purpose</Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Follow up on the Q3 proposal and suggest a meeting next week"
              rows={4}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Sarah, Marketing Lead at Acme"
            />
          </div>
          <div className="grid gap-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
                <SelectItem value="Persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={generate} disabled={loading} className="mt-2">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate email
          </Button>
        </>
      }
      output={<OutputEditor value={output} onChange={setOutput} placeholder="Your email draft will appear here." />}
    />
  );
}
