// Simple session management using localStorage for demo purposes
// In production, use JWT or secure cookies

export function setSession(user: { id: string; name: string; email: string }) {
  if (typeof window !== "undefined") {
    localStorage.setItem("expense_user", JSON.stringify(user));
  }
}

export function getSession() {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("expense_user");
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("expense_user");
  }
}
