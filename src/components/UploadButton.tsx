"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UploadResponse {
  document?: {
    id: string;
  };
  error?: string;
}

export default function UploadButton() {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data: UploadResponse = await response.json();

      if (data.document?.id) {
        router.push(`/chat/${data.document.id}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label className="relative cursor-pointer">
        <input
          type="file"
          className="hidden"
          accept="application/pdf"
          onChange={handleUpload}
          disabled={isUploading}
        />
        <span
          className={`inline-flex items-center px-4 py-2 rounded-md text-white ${
            isUploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isUploading ? "Uploading..." : "Upload PDF"}
        </span>
      </label>
    </div>
  );
}
