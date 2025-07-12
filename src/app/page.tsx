
"use client";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default function Home() {
  const user = typeof window !== "undefined" ? getSession() : null;
  if (!user) {
    redirect("/login");
    return null;
  }
  redirect("/dashboard");
  return null;
}
