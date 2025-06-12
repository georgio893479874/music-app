"use client";

import { useState } from "react";

type UploadResponse = {
  secure_url: string;
};

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<UploadResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        accept="image/*"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload
      </button>

      {response && (
        <div className="mt-4 text-sm text-green-700">
          ✅ Uploaded: {response.secure_url}
        </div>
      )}
    </form>
  );
}
