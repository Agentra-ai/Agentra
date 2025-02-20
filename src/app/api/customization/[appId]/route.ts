import {
  getAppCustomization,
  updateAppCustomization,
} from "@/actions/customization/customization-action";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { appId: string } },
) {
  const customization = await getAppCustomization(params.appId);
  return NextResponse.json({ data: customization });
}

export async function PUT(
  request: Request,
  { params }: { params: { appId: string } },
) {
  try {
    const data = await request.json();
    console.log("updated API", data);

    // Convert date strings to Date objects
    const sanitizedData = {
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: new Date(), // Always use current date for updates
    };

    await updateAppCustomization(params.appId, sanitizedData);
    return NextResponse.json({ message: "Update customization success" });
  } catch (error) {
    console.error("Error updating customization:", error);
    return NextResponse.json(
      { error: "Failed to update customization" },
      { status: 500 },
    );
  }
}
