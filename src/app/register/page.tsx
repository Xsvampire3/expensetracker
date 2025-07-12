"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-800 dark:text-white"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-800 dark:text-white"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-800 dark:text-white"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {error && <div className="mt-2 text-red-600 text-center text-sm">{error}</div>}
        <div className="mt-4 text-center text-sm">
          Already have an account? <a href="/login" className="text-green-600 hover:underline">Login</a>
        </div>
      </div>
    </div>
  );
}
