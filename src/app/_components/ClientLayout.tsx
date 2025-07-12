"use client";
import React from "react";
import { clearSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const navOptions = [
    { label: "Dashboard", href: "/dashboard", icon: "🏠" },
    { label: "Entries", href: "/entries", icon: "📋" },
        { label: "Add Entry", href: "/entry", icon: "➕" },
  ];
  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)"
      }}
    >
      {/* Responsive Floating Navbar */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-3 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl px-2 sm:px-6 py-2 sm:py-3 flex overflow-x-auto items-center gap-2 sm:gap-6 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl"
        style={{
          background: "linear-gradient(90deg, #f8fafc 0%, #e0e7ff 100%)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          border: "1px solid rgba(203,213,225,0.5)"
        }}
      >
        {navOptions.map((opt, idx) => (
          <motion.button
            key={opt.href}
            onClick={() => router.push(opt.href)}
            whileHover={{ scale: 1.08, backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-semibold text-gray-700 dark:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 shadow-none border-none outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
            style={{ cursor: "pointer" }}
          >
            <span className="text-lg">{opt.icon}</span>
            <span>{opt.label}</span>
          </motion.button>
        ))}
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.08, backgroundColor: "#fee2e2" }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-semibold text-red-600 dark:text-red-400 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 shadow-none border-none outline-none focus:ring-2 focus:ring-red-500 whitespace-nowrap"
          style={{ cursor: "pointer" }}
        >
          <span className="text-lg">🚪</span>
          <span>Logout</span>
        </motion.button>
      </motion.nav>
      {/* Page Content */}
      <div className="pt-20 sm:pt-24 min-h-screen">
        {children}
      </div>
    </div>
  );
}
