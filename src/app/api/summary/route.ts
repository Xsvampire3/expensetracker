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

  const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : null;
  const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : null;

  const buildMatch = (from: Date | null, to: Date | null) => {
    const match: any = { user: userObjectId };
    if (from && to) match.date = { $gte: from, $lte: to };
    else if (from) match.date = { $gte: from };
    else if (to) match.date = { $lte: to };
    return match;
  };

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const chartMatch = (startDate || endDate)
    ? buildMatch(startDate, endDate)
    : { user: userObjectId, date: { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13) } };
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

  const [day, week, month, year, categoryExpenses, incomeVsExpense] = await Promise.all([
    Entry.aggregate([
      { $match: buildMatch(startOfDay, null) },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    Entry.aggregate([
      { $match: buildMatch(startOfWeek, null) },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    Entry.aggregate([
      { $match: buildMatch(startOfMonth, null) },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    Entry.aggregate([
      { $match: buildMatch(startOfYear, null) },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    Entry.aggregate([
      { $match: { ...buildMatch(startDate, endDate), type: "expense" } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } }
    ]),
    Entry.aggregate([
      { $match: buildMatch(startDate, endDate) },
      { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ])
  ]);

  return NextResponse.json({ day, week, month, year, chartData, categoryExpenses, incomeVsExpense });
}
