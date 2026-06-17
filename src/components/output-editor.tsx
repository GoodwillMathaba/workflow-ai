import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, Eye, Pencil } from "lucide-react";

export function OutputEditor({
  value,
  onChange,
  placeholder = "AI output will appear here...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-sm font-medium">Output</span>
        <div className="flex items-center gap-1">
          <Button
            variant={mode === "preview" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMode("preview")}
          >
            <Eye className="mr-1 h-3.5 w-3.5" /> Preview
          </Button>
          <Button
            variant={mode === "edit" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMode("edit")}
          >
            <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={copy} disabled={!value}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>
      <div className="min-h-[300px] flex-1 p-4">
        {mode === "edit" ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-full min-h-[280px] resize-none border-0 p-0 shadow-none focus-visible:ring-0"
          />
        ) : value ? (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{value}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{placeholder}</p>
        )}
      </div>
    </div>
  );
}
