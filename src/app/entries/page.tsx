"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";
import { Filter, Calendar, DollarSign, TrendingUp, TrendingDown, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const defaultFilters = {
  type: "all",
  category: "",
  minAmount: "",
  maxAmount: "",
  startDate: "",
  endDate: "",
};

export default function EntriesPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);

   const handleDeleteClick = (entryId: string) => {
    setEntryToDelete(entryId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!entryToDelete || !user) return;
    await fetch(`/api/entry?id=${entryToDelete}&userId=${user.id}`, {
      method: "DELETE",
    });
    setShowModal(false);
    setEntryToDelete(null);
    fetchEntries(user.id, filters, page);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setEntryToDelete(null);
  };

  useEffect(() => {
    const sessionUser = getSession();
    if (!sessionUser) {
      router.push("/login");
    } else {
      setUser(sessionUser);
      fetchEntries(sessionUser.id, filters, page);
      fetchCategories(sessionUser.id);
    }
    // eslint-disable-next-line
  }, [router, filters, page]);

  const fetchCategories = async (userId: string) => {
    const res = await fetch(`/api/categories?userId=${userId}`);
    const data = await res.json();
    setCategories(data.categories || []);
  };

  const fetchEntries = async (userId: string, filters: any, page: number) => {
    setLoading(true);
    const params = new URLSearchParams({
      userId,
      page: page.toString(),
      type: filters.type,
      category: filters.category,
      minAmount: filters.minAmount,
      maxAmount: filters.maxAmount,
      startDate: filters.startDate,
      endDate: filters.endDate,
    });
    const res = await fetch(`/api/entry?${params.toString()}`);
    const data = await res.json();
    setEntries(data.entries || []);
    setTotalPages(data.totalPages || 1);
    setIncomeTotal(data.incomeTotal || 0);
    setExpenseTotal(data.expenseTotal || 0);
    setLoading(false);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const netTotal = incomeTotal - expenseTotal;

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
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
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
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
         <div className="absolute inset-0 overflow-hidden">
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
      <div className="max-w-7xl mx-auto px-4 py-2">
        {/* Header */}
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">All Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track your financial entries</p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" variants={containerVariants}>
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            variants={cardVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Income</p>
                <motion.p 
                  className="text-2xl font-bold text-green-600"
                  key={incomeTotal}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  ₹{incomeTotal.toLocaleString()}
                </motion.p>
              </div>
              <motion.div 
                className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <TrendingUp className="h-6 w-6 text-green-600" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            variants={cardVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
                <motion.p 
                  className="text-2xl font-bold text-red-600"
                  key={expenseTotal}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  ₹{expenseTotal.toLocaleString()}
                </motion.p>
              </div>
              <motion.div 
                className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <TrendingDown className="h-6 w-6 text-red-600" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            variants={cardVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Balance</p>
                <motion.p 
                  className={`text-2xl font-bold ${netTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}
                  key={netTotal}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  ₹{netTotal.toLocaleString()}
                </motion.p>
              </div>
              <motion.div 
                className={`h-12 w-12 rounded-lg flex items-center justify-center ${netTotal >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <DollarSign className={`h-6 w-6 ${netTotal >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
          variants={itemVariants}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Filter className="h-5 w-5" />
              </motion.div>
              <span className="font-medium">Filters</span>
              <span className="text-sm text-gray-500">({Object.values(filters).filter(v => v && v !== 'all').length} active)</span>
            </motion.button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                className="p-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {[
                    { name: "type", label: "Type", type: "select", options: [
                      { value: "all", label: "All Types" },
                      { value: "income", label: "Income" },
                      { value: "expense", label: "Expense" }
                    ]},
                    { name: "category", label: "Category", type: "select", options: [
                      { value: "", label: "All Categories" },
                      ...categories.map(cat => ({ value: cat, label: cat }))
                    ]},
                    { name: "minAmount", label: "Min Amount", type: "number", placeholder: "₹0" },
                    { name: "maxAmount", label: "Max Amount", type: "number", placeholder: "₹∞" },
                    { name: "startDate", label: "Start Date", type: "date" },
                    { name: "endDate", label: "End Date", type: "date" }
                  ].map((field, index) => (
                    <motion.div key={field.name} variants={itemVariants}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <select 
                          name={field.name} 
                          value={filters[field.name as keyof typeof filters]} 
                          onChange={handleFilterChange} 
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          {field.options?.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          name={field.name} 
                          type={field.type} 
                          value={filters[field.name as keyof typeof filters]} 
                          onChange={handleFilterChange} 
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      )}
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div 
                  className="mt-4 flex gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    onClick={resetFilters}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear Filters
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Entries Table */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          variants={itemVariants}
        >
          <div className="p-6">
            <motion.div 
              className="flex items-center justify-between mb-4"
              variants={itemVariants}
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
              <motion.div 
                className="text-sm text-gray-500 dark:text-gray-400"
                key={entries.length}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {entries.length} entries found
              </motion.div>
            </motion.div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  className="flex items-center justify-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key="loading"
                >
                  <motion.div 
                    className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="ml-2 text-gray-500 dark:text-gray-400">Loading transactions...</span>
                </motion.div>
              ) : entries.length === 0 ? (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  key="empty"
                >
                  <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">No transactions found</div>
                  <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or add some entries</p>
                </motion.div>
              ) : (
                <motion.div 
                  className="overflow-x-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key="table"
                >
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Notes</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {entries.map((entry, index) => (
                          <motion.tr 
                            key={entry._id} 
                            className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            variants={tableRowVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {new Date(entry.date).toLocaleDateString('en-IN', { 
                                    day: '2-digit', 
                                    month: 'short', 
                                    year: 'numeric' 
                                  })}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <motion.span 
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  entry.type === "income" 
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                }`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.05 + 0.1 }}
                              >
                                {entry.type === "income" ? "Income" : "Expense"}
                              </motion.span>
                            </td>
                            <td className="py-4 px-4">
                              <motion.span 
                                className={`font-semibold ${
                                  entry.type === "income" ? "text-green-600" : "text-red-600"
                                }`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.05 + 0.2 }}
                              >
                                ₹{entry.amount.toLocaleString()}
                              </motion.span>
                            </td>
                            <td className="py-4 px-4">
                              <motion.span 
                                className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.05 + 0.3 }}
                              >
                                {entry.category}
                              </motion.span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate block" title={entry.notes}>
                                {entry.notes}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <motion.button
                                onClick={() => handleDeleteClick(entry._id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete transaction"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </motion.button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          <AnimatePresence>
            {totalPages > 1 && (
              <motion.div 
                className="px-6 py-4 border-t border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={page !== 1 ? { scale: 1.1 } : {}}
                      whileTap={page !== 1 ? { scale: 0.9 } : {}}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </motion.button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          page === i + 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        {i + 1}
                      </motion.button>
                    ))}
                    <motion.button
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={page !== totalPages ? { scale: 1.1 } : {}}
                      whileTap={page !== totalPages ? { scale: 0.9 } : {}}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div 
                className="flex items-center gap-3 mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div 
                  className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Trash2 className="h-6 w-6 text-red-600" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Transaction</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
                </div>
              </motion.div>
              <motion.p 
                className="text-gray-700 dark:text-gray-300 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Are you sure you want to delete this transaction? This will permanently remove it from your records.
              </motion.p>
              <motion.div 
                className="flex gap-3 justify-end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete Transaction
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
