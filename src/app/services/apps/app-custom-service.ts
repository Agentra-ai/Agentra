// ...existing code...

import { AppCustomization } from "@/drizzle/schema";

export async function fetchAppCustomization(appId: string) {
  const res = await fetch(`/api/customization/${appId}`, {
    method: "GET",
  });
  const { data } = await res.json();
  return data as AppCustomization;
}

export async function saveAppCustomization(
  appId: string,
  data: AppCustomization,
) {
  console.log("data", data);
  const res = await fetch(`/api/customization/${appId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function uploadFileToS3(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/s3upload/image", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Upload failed");
  }
  const data = await res.json();
  return data;
}
