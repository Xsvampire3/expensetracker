"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getSession } from "@/lib/session";
import { PlusCircle, Calendar, FileText, CheckCircle, X, ArrowLeft, Wallet, TrendingUp, TrendingDown } from "lucide-react";

export default function Page() {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryMode, setCategoryMode] = useState<"select"|"input">("select");
  const [showSuccess, setShowSuccess] = useState(false);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const user = getSession();
    if (!user) {
      router.push("/login");
    } else {
      setUserId(user.id);
      fetchCategories(user.id);
    }
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, [router]);

  const fetchCategories = async (userId: string) => {
    const res = await fetch(`/api/categories?userId=${userId}`);
    const data = await res.json();
    setCategories(data.categories || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!amount || !type || !category || !date) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }
   if (!userId) {
      setError("User session not found");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount: Number(amount), type, category, date, notes }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add entry");
      } else {
        setAmount("");
        setType("");
        setCategory("");
        setDate("");
        setNotes("");
        setShowSuccess(true);
        if (categoryMode === "input" && category && !categories.includes(category)) {
          setCategories(prev => [...prev, category]);
        }
        setCategoryMode("select");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleCategoryOther = () => {
    setCategory("");
    setCategoryMode("input");
  };

  const handleBackToSelect = () => {
    setCategory("");
    setCategoryMode("select");
  };

   const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

   const headerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  const typeButtonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

    const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

   const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const particleRefs = React.useRef<(HTMLDivElement|null)[]>([]);
    useEffect(() => {
      if (typeof window !== 'undefined') {
        particleRefs.current.forEach((ref) => {
          if (ref) {
            ref.style.left = `${Math.random() * 100}%`;
            ref.style.top = `${Math.random() * 100}%`;
            ref.style.animationDelay = `${Math.random() * 2}s`;
            ref.style.animationDuration = `${2 + Math.random() * 2}s`;
          }
        });
      }
    }, []);

  return (
 <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 py-2 px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        {/* Floating particles: always render 20, random styles only on client */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              ref={el => { particleRefs.current[i] = el; }}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
              style={{}}
            />
          ))}
        </div>
      </div>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-2 flex gap-4 items-center"
          variants={headerVariants}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Wallet className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Add Entry
          </motion.h1>
        </motion.div>

        {/* Main Form Card */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
          variants={itemVariants}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
          >
            {/* Amount Input */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center text-lg font-bold">₹</span>
                <motion.input
                  type="number"
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  disabled={loading}
                  step="0.01"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </motion.div>

            {/* Type Selection */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  onClick={() => setType("income")}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    type === "income"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:border-green-300"
                  }`}
                  disabled={loading}
                  variants={typeButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Income</span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setType("expense")}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    type === "expense"
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                      : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-300"
                  }`}
                  disabled={loading}
                  variants={typeButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <TrendingDown className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Expense</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Category Selection */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <AnimatePresence mode="wait">
                {categoryMode === "select" ? (
                  <motion.div 
                    className="space-y-3"
                    key="select"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.select
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      disabled={loading}
                      whileFocus={{ scale: 1.02 }}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </motion.select>
                    <motion.button
                      type="button"
                      onClick={handleCategoryOther}
                      className="w-full p-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 flex items-center justify-center gap-2"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <PlusCircle className="w-5 h-5" />
                      Add New Category
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="space-y-3"
                    key="input"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2">
                      <motion.button
                        type="button"
                        onClick={handleBackToSelect}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        disabled={loading}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </motion.button>
                      <motion.input
                        type="text"
                        placeholder="Enter new category"
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        required
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        disabled={loading}
                        whileFocus={{ scale: 1.02 }}
                        autoFocus
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Date Input */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <motion.input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  disabled={loading}
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </motion.div>

            {/* Notes Input */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <motion.textarea
                  placeholder="Add any additional notes..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  disabled={loading}
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div 
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Adding Entry...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <PlusCircle className="w-5 h-5" />
                  Add Entry
                </div>
              )}
            </motion.button>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </motion.div>
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="text-center">
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </motion.div>
                </motion.div>
                <motion.h2 
                  className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  Success!
                </motion.h2>
                <motion.p 
                  className="text-gray-600 dark:text-gray-400 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  Your entry has been added successfully.
                </motion.p>
                <motion.button
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform"
                  onClick={() => setShowSuccess(false)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

