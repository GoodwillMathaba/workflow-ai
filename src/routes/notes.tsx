import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FileText, Loader2, Mic, Square } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { runAiPrompt } from "@/lib/ai.functions";
import { ToolShell } from "@/components/tool-shell";
import { OutputEditor } from "@/components/output-editor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (e: any) => void;
  onerror: (e: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
};

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
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const baseTextRef = useRef("");

  useEffect(() => {
    const SR =
      (typeof window !== "undefined" &&
        ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) ||
      null;
    if (!SR) {
      setSupported(false);
      return;
    }
    const rec: SpeechRecognitionLike = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e: any) => {
      let finalText = "";
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t;
        else interim += t;
      }
      if (finalText) {
        baseTextRef.current = (baseTextRef.current + " " + finalText).trim();
      }
      setNotes((baseTextRef.current + " " + interim).trim());
    };
    rec.onerror = (e: any) => {
      toast.error(`Mic error: ${e.error ?? "unknown"}`);
      setRecording(false);
    };
    rec.onend = () => setRecording(false);
    recognitionRef.current = rec;
    return () => {
      try {
        rec.stop();
      } catch {}
    };
  }, []);

  const toggleRecording = () => {
    const rec = recognitionRef.current;
    if (!rec) {
      toast.error("Voice recording isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    if (recording) {
      rec.stop();
      setRecording(false);
    } else {
      baseTextRef.current = notes;
      try {
        rec.start();
        setRecording(true);
      } catch (e) {
        toast.error("Couldn't start recording");
      }
    }
  };

  const generate = async () => {
    if (!notes.trim()) {
      toast.error("Please paste or record meeting notes.");
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
      description="Paste, type, or record your notes and get a structured summary."
      icon={FileText}
      inputs={
        <>
          <div className="grid flex-1 gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notes">Meeting notes</Label>
              <Button
                type="button"
                size="sm"
                variant={recording ? "destructive" : "secondary"}
                onClick={toggleRecording}
                disabled={!supported}
                title={supported ? "Record voice" : "Voice not supported in this browser"}
              >
                {recording ? (
                  <>
                    <Square className="mr-2 h-4 w-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Record
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                baseTextRef.current = e.target.value;
              }}
              placeholder="Paste your raw meeting notes here, or click Record to dictate..."
              className="min-h-[280px] flex-1"
            />
            {recording ? (
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                Listening… speak now
              </p>
            ) : null}
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
