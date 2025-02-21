export const runtime = "nodejs";

const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

import { NextRequest, NextResponse } from "next/server";
import { S3 } from "@aws-sdk/client-s3";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("Processing file:", file.name, "Size:", file.size);

    // Convert file to array buffer
    const buffer = await file.arrayBuffer();

    console.log("uploading to S3..........");

    const s3 = new S3({
      region: "eu-north-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
      },
    });

    const fileKey =
      "images/" + Date.now().toString() + "-" + file.name.replace(/\s+/g, "-");

    await s3.putObject({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: fileKey,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    });

    console.log("Upload successful:", fileKey);

    return NextResponse.json({
      file_key: fileKey,
      file_name: file.name,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
