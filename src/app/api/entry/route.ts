import { NextResponse } from "next/server";
import Entry from "@/models/Entry";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectToDatabase();
  const { userId, amount, type, category, date, notes } = await req.json();
  if (!userId || !amount || !type || !category || !date) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const entry = new Entry({ user: userId, amount, type, category, date, notes });
  await entry.save();
  return NextResponse.json({ message: "Entry added successfully" }, { status: 201 });
}

export async function GET(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const type = searchParams.get("type") || "all";
  const category = searchParams.get("category") || "";
  const minAmount = parseFloat(searchParams.get("minAmount") || "");
  const maxAmount = parseFloat(searchParams.get("maxAmount") || "");
  const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : null;
  const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : null;
  const filterMonth = searchParams.get("month"); // "01" to "12"
  const filterYear = searchParams.get("year");   // "2024", "2025", etc.
  const filterDate = searchParams.get("date");   // "2024-07-27"
  const filterWeek = searchParams.get("week");   // "2024-07-21" (start of week)
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 10;

  const query: any = { user: userId };
  if (type !== "all") query.type = type;
  if (category) query.category = { $regex: category, $options: "i" };
  if (!isNaN(minAmount)) query.amount = { ...query.amount, $gte: minAmount };
  if (!isNaN(maxAmount)) query.amount = { ...query.amount, $lte: maxAmount };
  
  // Handle date filtering with priority: date > week > month/year > date range
  if (filterDate) {
    const filterDateObj = new Date(filterDate);
    const startOfFilterDate = new Date(filterDateObj.getFullYear(), filterDateObj.getMonth(), filterDateObj.getDate());
    const endOfFilterDate = new Date(filterDateObj.getFullYear(), filterDateObj.getMonth(), filterDateObj.getDate(), 23, 59, 59, 999);
    query.date = { $gte: startOfFilterDate, $lte: endOfFilterDate };
  } else if (filterWeek) {
    const weekStartDate = new Date(filterWeek);
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6);
    weekEndDate.setHours(23, 59, 59, 999);
    query.date = { $gte: weekStartDate, $lte: weekEndDate };
  } else if (filterMonth || filterYear) {
    const yearNum = filterYear ? parseInt(filterYear) : new Date().getFullYear();
    
    if (filterMonth) {
      const monthNum = parseInt(filterMonth) - 1; // MongoDB months are 0-based
      const startOfFilterMonth = new Date(yearNum, monthNum, 1);
      const endOfFilterMonth = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);
      query.date = { $gte: startOfFilterMonth, $lte: endOfFilterMonth };
    } else if (filterYear) {
      const startOfFilterYear = new Date(yearNum, 0, 1);
      const endOfFilterYear = new Date(yearNum, 11, 31, 23, 59, 59, 999);
      query.date = { $gte: startOfFilterYear, $lte: endOfFilterYear };
    }
  } else {
    // Fallback to existing date range logic
    if (startDate) query.date = { ...query.date, $gte: startDate };
    if (endDate) query.date = { ...query.date, $lte: endDate };
  }

  const totalCount = await Entry.countDocuments(query);
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const entries = await Entry.find(query)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const allFilteredEntries = await Entry.find(query);
  const incomeTotal = allFilteredEntries.filter(e => e.type === "income").reduce((sum, e) => sum + e.amount, 0);
  const expenseTotal = allFilteredEntries.filter(e => e.type === "expense").reduce((sum, e) => sum + e.amount, 0);

  return NextResponse.json({ entries, totalPages, incomeTotal, expenseTotal });
}

export async function DELETE(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const entryId = searchParams.get("id");
  const userId = searchParams.get("userId");
  if (!entryId || !userId) {
    return NextResponse.json({ error: "Missing entryId or userId" }, { status: 400 });
  }
  const entry = await Entry.findOne({ _id: entryId, user: userId });
  if (!entry) {
    return NextResponse.json({ error: "Entry not found or unauthorized" }, { status: 404 });
  }
  await Entry.deleteOne({ _id: entryId });
  return NextResponse.json({ message: "Entry deleted successfully" });
}
