import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

const InputSchema = z.object({
  prompt: z.string().min(1).max(20000).optional(),
  system: z.string().max(4000).optional(),
  messages: z.array(MessageSchema).max(50).optional(),
});

export const runAiPrompt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const messages = data.messages
      ? data.messages
      : [
          ...(data.system ? [{ role: "system" as const, content: data.system }] : []),
          { role: "user" as const, content: data.prompt ?? "" },
        ];

    try {
      const { text } = await generateText({ model, messages });
      return { text };
    } catch (err: unknown) {
      const e = err as { statusCode?: number; status?: number; message?: string };
      const status = e.statusCode ?? e.status;
      if (status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
      if (status === 402)
        throw new Error("AI credits exhausted. Please add credits in your workspace billing.");
      throw new Error(e.message ?? "AI request failed");
    }
  });
