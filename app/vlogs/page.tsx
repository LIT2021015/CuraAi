"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VlogListPage() {
  const [search, setSearch] = useState("");
  const [vlogs, setVlogs] = useState<any[]>([]);

  const fetchVlogs = async () => {
    const res = await fetch(`/api/vlogs?search=${encodeURIComponent(search)}`);
    const data = await res.json();
    setVlogs(data);
  };

  useEffect(() => {
    fetchVlogs();
  }, [search]);

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Health Vlogs</h2>

      <div className="mb-6">
        <Input
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-lg"
        />
      </div>

      <div className="flex flex-col space-y-6">
        {vlogs.map((vlog) => (
          <Card key={vlog.id} className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h3 className="text-2xl font-semibold text-blue-800">{vlog.title}</h3>
                <p className="text-gray-600 text-sm mt-2 md:mt-0">By {vlog.user?.name || "Unknown"}</p>
              </div>

              <p className="text-gray-700 leading-relaxed text-base">
                {vlog.content.length > 500
                  ? `${vlog.content.substring(0, 500)}...`
                  : vlog.content}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {vlog.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <p className="text-xs text-gray-500 text-right">
                {new Date(vlog.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
