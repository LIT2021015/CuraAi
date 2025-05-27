'use client';

import { BackgroundGradient } from '@/components/ui/background-gradient';
import React, { useState } from 'react';


const Page = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<{ label: string; confidence: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert('Please upload an image');

    const formData = new FormData();
    formData.append('file', image);

    setLoading(true);
    setResult(null);

    const res = await fetch('/api/predict', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setResult({
        label: data.label,
        confidence: data.confidence,
      });
    } else {
      alert('Prediction Failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <BackgroundGradient
                  className="rounded-[22px] p-6 sm:p-10 bg-white dark:bg-zinc-800 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
      <div className="w-full max-w-xl rounded-2xl shadow-2xl p-8 transition-all duration-300">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-6">
          🧠 Brain Tumor Detection
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-500 transition"
          />

          {preview && (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-contain rounded-lg shadow-md border"
              />
              <p className="text-sm text-gray-500 text-center mt-2">Preview of the uploaded image</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Analyzing Image...' : 'Detect Tumor'}
          </button>
        </form>

        {result && (
          <div className="mt-8 text-center bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-inner">
            <h2 className="text-2xl font-bold text-blue-800 mb-3">🩺 Prediction Result</h2>
            <p className="text-lg text-gray-700 mb-1">
              <span className="font-semibold">Tumor Type:</span>{' '}
              <span className="text-blue-700 font-bold">{result.label}</span>
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Confidence:</span>{' '}
              <span className="text-green-700 font-bold">
                {(result.confidence * 100).toFixed(2)}%
              </span>
            </p>
          </div>
        )}
      </div>
      </BackgroundGradient>
    </div>
  );
};

export default Page;
