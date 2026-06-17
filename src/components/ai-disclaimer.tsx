import { AlertTriangle } from "lucide-react";

export function AiDisclaimer() {
  return (
    <div className="mx-4 mb-4 mt-2 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <p>
        AI-generated content may contain inaccuracies. Please review all outputs before using them for
        business decisions, client communication, or professional documentation.
      </p>
    </div>
  );
}
