"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface BloodStock {
  id: string;
  bloodGroup: string;
  quantity: number;
}

export default function BloodStockPage() {
  const [stock, setStock] = useState<BloodStock[]>([]);
  const [bloodGroup, setBloodGroup] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [error, setError] = useState("");

  const fetchStock = async () => {
    const res = await fetch("/api/hospital/blood-stock");
    if (res.ok) {
      const data = await res.json();
      setStock(data);
    }
  };

  const handleUpdate = async () => {
    setError("");
    if (!bloodGroup || typeof quantity !== "number" || isNaN(quantity) || quantity < 0) {
      setError("Please enter a valid blood group and quantity (≥ 0).");
      return;
    }

    const res = await fetch("/api/hospital/blood-stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bloodGroup: bloodGroup.trim(), quantity }),
    });

    if (res.ok) {
      await fetchStock();
      setBloodGroup("");
      setQuantity("");
    } else {
      alert("Failed to update stock");
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🩸 Manage Blood Stock</h1>

      <div className="space-y-4">
        <div>
          <Label>Blood Group</Label>
          <Input
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value.toUpperCase())}
            placeholder="e.g. A+"
          />
        </div>

        <div>
          <Label>Quantity (units)</Label>
          <Input
            type="number"
            min={0}
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value === "" ? "" : parseInt(e.target.value))
            }
            placeholder="e.g. 5"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <Button onClick={handleUpdate}>Update Stock</Button>
      </div>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">📋 Current Stock</h2>
      <ul className="space-y-2">
        {stock.length > 0 ? (
          stock.map((item) => (
            <li key={item.id} className="border p-2 rounded">
              <strong>{item.bloodGroup}</strong>: {item.quantity} units
            </li>
          ))
        ) : (
          <p>No stock data available.</p>
        )}
      </ul>
    </div>
  );
}
