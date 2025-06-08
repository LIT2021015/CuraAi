"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function ReminderPage() {
  const [message, setMessage] = useState("");
  const [time, setTime] = useState(""); // time in HH:mm format
  const [recurring, setRecurring] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      alert("Invalid time format.");
      return;
    }

    const res = await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        time, 
        recurring,
      }),
    });

    if (res.ok) alert("Reminder set!");
    else alert("Failed to set reminder.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 mt-15">
      <div>
        <Label htmlFor="message">Medicine Reminder</Label>
        <Input id="message" value={message} onChange={(e) => setMessage(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="time">Time (24h format - HH:MM)</Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="recurring" checked={recurring} onCheckedChange={(v) => setRecurring(Boolean(v))} />
        <Label htmlFor="recurring">Repeat daily</Label>
      </div>

      <Button type="submit">Set Reminder</Button>
    </form>
  );
}
