"use client";
import { BackgroundGradient } from "@/components/ui/background-gradient";
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

      if (!res.ok) throw new Error("Prediction failed. Check the backend server.");

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

  return (

    <main className="min-h-screen bg-gradient-to-br  flex items-center justify-center py-20 px-4">
      <BackgroundGradient
                  className="rounded-[22px] p-6 sm:p-10 bg-white dark:bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
      <div className="w-full max-w-xl rounded-2xl p-8 shadow-2xl backdrop-blur-lg bg-white/30 dark:bg-zinc-900/30 border border-white/20 dark:border-gray-700 transition-all">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-[#6A4C93] dark:text-[#9F7AEA]">
          🧪 COVID X-Ray Diagnosis
        </h1>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full mb-4 p-3 bg-white/80 dark:bg-zinc-900/40 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className={`w-full py-3 rounded-md text-white text-lg font-semibold transition duration-300 ${
            loading || !file
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#6A4C93] hover:bg-[#56357c]"
          }`}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>

        {error && (
          <p className="mt-4 text-center text-red-600 font-medium">{error}</p>
        )}

        {result && (
          <div className="mt-6 text-center space-y-3">
            <p className="text-lg">
              <strong>Confidence:</strong>{" "}
              <span className="text-cyan-700 dark:text-cyan-300">
                {(result.confidence * 100).toFixed(2)}%
              </span>
            </p>
            <p
              className={`text-lg font-bold ${
                result.class === 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {getDiagnosisMessage()}
            </p>
          </div>
        )}
      </div>
      </BackgroundGradient>
    </main>
  );
}
