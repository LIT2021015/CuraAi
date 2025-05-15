"use client";
import { useState } from "react";

interface PredictionResult {
  class: number;
  confidence: number;
}

export default function CovidDiagnosis() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://covid-backend-yzg3.onrender.com/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Prediction failed. Check the backend server.");
      }

      const data: PredictionResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDiagnosisMessage = () => {
    if (!result) return "";
    return result.class === 0
      ? "⚠️ You might be COVID Positive. Please consult a doctor immediately."
      : "✅ You are likely Normal. Stay safe!";
  };

  const getDiagnosisStyle = () => {
    if (!result) return {};
    return {
      color: result.class === 0 ? "#d00000" : "#007f00",
      fontWeight: "bold",
      fontSize: "18px",
      marginTop: "10px",
    };
  };

  return (
    <main
      style={{
        maxWidth: "600px",
        margin: "80px auto 100px",
        padding: "20px",
        boxShadow: "0 0 15px rgba(0,0,0,0.1)",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: "28px", marginBottom: "20px" }}>
        🧪 COVID X-Ray Diagnosis
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        style={{
          display: "block",
          margin: "20px auto",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "6px",
        }}
      />

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        style={{
          display: "block",
          margin: "10px auto",
          padding: "12px 24px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Predicting..." : "Predict"}
      </button>

      {error && (
        <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>{error}</p>
      )}

      {result && (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <p>
            <strong>Confidence:</strong>{" "}
            {(result.confidence * 100).toFixed(2)}%
          </p>
          <p style={getDiagnosisStyle()}>{getDiagnosisMessage()}</p>
        </div>
      )}
    </main>
  );
}
