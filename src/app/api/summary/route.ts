import { NextResponse } from "next/server";
import Entry from "@/models/Entry";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const userObjectId = userId && mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : "";
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const filterMonth = searchParams.get("month"); // "01" to "12"
  const filterYear = searchParams.get("year");   // "2024", "2025", etc.
  const filterDate = searchParams.get("date");   // "2024-07-27"
  const filterWeek = searchParams.get("week");   // "2024-07-21" (start of week)

  const buildMatch = (from: Date | null, to: Date | null, monthFilter?: string | null, yearFilter?: string | null, dateFilter?: string | null, weekFilter?: string | null) => {
    const match: any = { user: userObjectId };
    
    // Priority: date > week > month/year > default date range
    if (dateFilter) {
      const filterDateObj = new Date(dateFilter);
      const startOfFilterDate = new Date(filterDateObj.getFullYear(), filterDateObj.getMonth(), filterDateObj.getDate());
      const endOfFilterDate = new Date(filterDateObj.getFullYear(), filterDateObj.getMonth(), filterDateObj.getDate(), 23, 59, 59, 999);
      match.date = { $gte: startOfFilterDate, $lte: endOfFilterDate };
    } else if (weekFilter) {
      const weekStartDate = new Date(weekFilter);
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekStartDate.getDate() + 6);
      weekEndDate.setHours(23, 59, 59, 999);
      match.date = { $gte: weekStartDate, $lte: weekEndDate };
    } else if (monthFilter || yearFilter) {
      const yearNum = yearFilter ? parseInt(yearFilter) : new Date().getFullYear();
      
      if (monthFilter) {
        const monthNum = parseInt(monthFilter) - 1; // MongoDB months are 0-based
        const startOfFilterMonth = new Date(yearNum, monthNum, 1);
        const endOfFilterMonth = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);
        match.date = { $gte: startOfFilterMonth, $lte: endOfFilterMonth };
      } else if (yearFilter) {
        const startOfFilterYear = new Date(yearNum, 0, 1);
        const endOfFilterYear = new Date(yearNum, 11, 31, 23, 59, 59, 999);
        match.date = { $gte: startOfFilterYear, $lte: endOfFilterYear };
      }
    } else {
      // Fallback to date range logic if no filters
      if (from && to) match.date = { $gte: from, $lte: to };
      else if (from) match.date = { $gte: from };
      else if (to) match.date = { $lte: to };
    }
    
    return match;
  };

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Chart data with filtering (only month/year filters affect charts)
  const chartMatch = buildMatch(null, null, filterMonth, filterYear, null, null);
  // If no month/year filters, show last 14 days
  if (!filterMonth && !filterYear) {
    chartMatch.date = { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13) };
  }
  
  const chartData = await Entry.aggregate([
    { $match: chartMatch },
    { $group: {
      _id: {
        $dateToString: { format: "%Y-%m-%d", date: "$date" }
      },
      total: { $sum: "$amount" },
      type: { $first: "$type" }
    } },
    { $sort: { _id: 1 } }
  ]);

  const [dayData, weekData, monthData, yearData, categoryExpenses, incomeVsExpense] = await Promise.all([
    Entry.aggregate([
      { $match: filterDate ? buildMatch(null, null, null, null, filterDate, null) : 
                filterMonth || filterYear ? buildMatch(null, null, filterMonth, filterYear, null, null) : 
                buildMatch(startOfDay, null) },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    Entry.aggregate([
      { $match: filterWeek ? buildMatch(null, null, null, null, null, filterWeek) :
                filterMonth || filterYear ? buildMatch(null, null, filterMonth, filterYear, null, null) : 
                buildMatch(startOfWeek, null) },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    Entry.aggregate([
      { $match: filterMonth || filterYear ? buildMatch(null, null, filterMonth, filterYear, null, null) : buildMatch(startOfMonth, null) },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    Entry.aggregate([
      { $match: filterMonth || filterYear ? buildMatch(null, null, filterMonth, filterYear, null, null) : buildMatch(startOfYear, null) },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    Entry.aggregate([
      { $match: { ...buildMatch(null, null, filterMonth, filterYear, null, null), type: "expense" } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } }
    ]),
    Entry.aggregate([
      { $match: buildMatch(null, null, filterMonth, filterYear, null, null) },
      { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ])
  ]);

  return NextResponse.json({ 
    day: dayData, 
    week: weekData, 
    month: monthData, 
    year: yearData, 
    chartData, 
    categoryExpenses, 
    incomeVsExpense 
  });
}
