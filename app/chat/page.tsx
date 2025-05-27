"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "You", text: input };
    setChat((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", { message: input });
      const botMessage = { sender: "Bot", text: res.data.reply };

      setChat((prev) => [...prev, botMessage]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { sender: "Bot", text: "❌ Failed to get response" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col mt-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
  {/* Chat Window */}
  <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
    {chat.map((msg, idx) => (
      <div
        key={idx}
        className={`max-w-[75%] px-4 py-2 rounded-xl text-sm shadow-sm whitespace-pre-wrap
          ${
            msg.sender === "You"
              ? "bg-blue-600 text-white self-end ml-auto"
              : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white self-start mr-auto"
          }`}
      >
        <p className="text-xs font-semibold mb-1">{msg.sender}</p>
        {msg.text}
      </div>
    ))}
    {loading && (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Bot is typing...
      </div>
    )}
    <div ref={chatRef} />
  </div>

  {/* Input Bar */}
  <div className="border-t dark:border-gray-700 px-4 py-3 flex gap-2 bg-gray-50 dark:bg-gray-800">
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSend()}
      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white outline-none"
      placeholder="Type your message..."
    />
    <button
      onClick={handleSend}
      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
    >
      Send
    </button>
  </div>
</div>
  );
}
