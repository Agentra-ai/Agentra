import { NextResponse } from "next/server";
import { getFileByFileId } from "@/actions/documents/app-docs-action";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");
  if (!fileId) {
    return NextResponse.json({ error: "File ID is missing" }, { status: 400 });
  }
  try {
    const details = await getFileByFileId(fileId);
    return NextResponse.json({ data: details });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch file details" },
      { status: 500 },
    );
  }
}
