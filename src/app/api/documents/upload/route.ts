// "use server";
// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const Bucket = process.env.NEXT_PUBLIC_S3_BUCKET_NAME!;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  const response = await s3.send(new ListObjectsCommand({ Bucket }));
  return NextResponse.json(response?.Contents ?? []);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll("file") as File[];

  const results = await Promise.all(
    files.map(async (file) => {
      const arrayBuf = await file.arrayBuffer();
      const Body = Buffer.from(arrayBuf);
      return s3.send(
        new PutObjectCommand({
          Bucket,
          Key: file.name,
          Body,
        }),
      );
    }),
  );

  return NextResponse.json({ success: true, results });
}
