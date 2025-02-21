import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const baseModel = searchParams.get('baseModel')?.toUpperCase() || '';
  const apiKey = process.env[`${baseModel}_API_KEY`] || null;
  return NextResponse.json({ apiKey });
}
