import mongoose, { Schema, Document } from "mongoose";

export interface IEntry extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Date;
  notes?: string;
}

const EntrySchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
});

export default mongoose.models.Entry || mongoose.model<IEntry>("Entry", EntrySchema);
