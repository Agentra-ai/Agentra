"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const SimpleUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    file_key: string;
    file_name: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("No file selected");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await fetch("/api/s3upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Upload failed");
      }
      const data = await res.json();
      setUploadResult(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Upload error");
    }
  };

  return (
    <div>
      <h1>Simple File Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!selectedFile}>
        Upload
      </Button>
      {uploadResult && (
        <div>
          <p>File Key: {uploadResult.file_key}</p>
          <p>File Name: {uploadResult.file_name}</p>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SimpleUpload;
