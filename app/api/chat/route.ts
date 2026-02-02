import { OpenAI } from "openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, model, customInstructions, tone } = await req.json();

    const client = new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
    });

    const systemPrompt = process.env.SYSTEM_PROMPT || "";
    let finalSystemPrompt = systemPrompt;

    if (customInstructions) {
      finalSystemPrompt += `\n\nUser Custom Instructions:\n${customInstructions}`;
    }

    if (tone && tone !== "Standard") {
      finalSystemPrompt += `\n\nResponse Tone: ${tone}`;
    }

    const finalMessages = [
      { role: "system", content: finalSystemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const stream = await client.chat.completions.create({
      model: model || "llama-3.3-70b-versatile",
      messages: finalMessages,
      stream: true,
      max_tokens: 2048,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content || "";
            if (content) controller.enqueue(encoder.encode(content));
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          controller.enqueue(
            encoder.encode(`Error from upstream provider: ${msg}`),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
