

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function Home() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  } else {
    redirect("/dashboard");
  }
  return null;
}
