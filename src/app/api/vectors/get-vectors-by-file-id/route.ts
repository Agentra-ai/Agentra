import { NextResponse } from "next/server";
import { getVectorsByfileId } from "@/actions/vectors/vectordb-action";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");
  if (!fileId) {
    return NextResponse.json({ error: "File ID is missing" }, { status: 400 });
  }
  try {
    const data = await getVectorsByfileId(fileId);
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch vectors" },
      { status: 500 },
    );
  }
}
