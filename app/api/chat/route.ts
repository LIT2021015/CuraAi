import { NextResponse } from "next/server";
import axios from "axios";

let conversation: any[] = [
  { role: "system", content: "You are a helpful assistant." },
];

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    conversation.push({ role: "user", content: message });

    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: conversation,
      },
      {
        headers: {
          // Authorization: "Bearer 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",
          // Authorization : "Bearer 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",
          Authorization : process.env.CHAT_PASS,
          "Content-Type": "application/json",
        },
      }
    );

    const openRouterMessage = res.data.choices?.[0]?.message;
    // console.log("✅ OpenRouter message:", openRouterMessage);

    const reply = openRouterMessage?.content || "⚠️ No content received";

    conversation.push({ role: "assistant", content: reply });

    return NextResponse.json({ reply });
  } catch (error: any) {
    // console.error("❌ API error:", error.message);
    return NextResponse.json({ reply: "⚠️ API error occurred." }, { status: 500 });
  }
}
