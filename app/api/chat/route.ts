import { OpenAI } from "openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    const client = new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
    });

    const systemPrompt = process.env.SYSTEM_PROMPT || "";
    const finalMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
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
        } catch (err: any) {
          const msg =
            err?.message ||
            (typeof err === "string" ? err : "Unknown upstream error");
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
  } catch (err: any) {
    const msg =
      err?.message || (typeof err === "string" ? err : "Unknown error");
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
