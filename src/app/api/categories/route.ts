import { NextResponse } from "next/server";
import Entry from "@/models/Entry";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  const categories = await Entry.distinct("category", { user: userId });
  return NextResponse.json({ categories });
}
