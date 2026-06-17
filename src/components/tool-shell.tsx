import { type ReactNode } from "react";

export function ToolShell({
  title,
  description,
  icon: Icon,
  inputs,
  output,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  inputs: ReactNode;
  output: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="grid flex-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-4">{inputs}</div>
        <div className="flex flex-col">{output}</div>
      </div>
    </div>
  );
}
