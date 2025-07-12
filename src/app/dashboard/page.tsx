"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<any[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });
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

  useEffect(() => {
    const fetchSession = async () => {
      const sessionUser = await getSession();
      if (!sessionUser) {
        router.push("/login");
      } else {
        setUser(sessionUser);
        fetchSummary(sessionUser.id, filters.startDate, filters.endDate);
        fetchEntries(sessionUser.id);
      }
    };
    fetchSession();
    // eslint-disable-next-line
  }, [router, filters]);

  const fetchSummary = async (userId: string, startDate?: string, endDate?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ userId });
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      const res = await fetch(`/api/summary?${params.toString()}`);
      const data = await res.json();
      setSummary(data);
    } catch {
      setSummary(null);
    }
    setLoading(false);
  };

  const fetchEntries = async (userId: string) => {
    setEntriesLoading(true);
    try {
      const res = await fetch(`/api/entry?userId=${userId}`);
      const data = await res.json();
      setEntries(data.entries || []);
    } catch {
      setEntries([]);
    }
    setEntriesLoading(false);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleClearFilters = () => {
    setFilters({ startDate: "", endDate: "" });
  };

  const totalIncome = summary?.year?.find((s:any)=>s._id==='income')?.total || 0;
  const totalExpense = summary?.year?.find((s:any)=>s._id==='expense')?.total || 0;
  const overallBalance = totalIncome - totalExpense;

  const getBalance = (arr:any[]) => {
    const income = arr?.find((s:any)=>s._id==='income')?.total || 0;
    const expense = arr?.find((s:any)=>s._id==='expense')?.total || 0;
    return income - expense;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Record<string, any> = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
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

      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-2 max-w-7xl">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <motion.h1 
                  layoutId="dashboard-title" 
                  className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                >
                  Financial Dashboard
                </motion.h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Welcome back, {user?.name || 'User'}!</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl border border-white/20"
              >
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Overall Balance</div>
                <div className={`text-3xl font-bold ${overallBalance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  ₹{loading ? <span className="animate-pulse">...</span> : overallBalance.toLocaleString()}
                </div>
              </motion.div>
              
              {/* Filter Controls */}
              <div className="flex flex-wrap gap-3 items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border border-white/20">
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                {(filters.startDate || filters.endDate) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium hover:shadow-lg transition-all duration-200"
                    onClick={handleClearFilters}
                  >
                    Clear
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {[
              { title: "Today", key: "day", color: "from-blue-500 to-cyan-500", icon: "📅" },
              { title: "Week", key: "week", color: "from-emerald-500 to-green-500", icon: "📊" },
              { title: "Month", key: "month", color: "from-amber-500 to-orange-500", icon: "📈" },
              { title: "Year", key: "year", color: "from-purple-500 to-pink-500", icon: "🎯" }
            ].map((period) => {
              const expense = summary?.[period.key]?.find((s:any)=>s._id==='expense')?.total || 0;
              const income = summary?.[period.key]?.find((s:any)=>s._id==='income')?.total || 0;
              const balance = getBalance(summary?.[period.key] || []);
              
              return (
                <motion.div
                  key={period.key}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    transition: { duration: 0.2 }
                  }}
                  className="relative group"
                >
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${period.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{period.title}</h3>
                        <span className="text-2xl">{period.icon}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Expense</span>
                          <span className="text-xl font-bold text-red-500">
                            ₹{loading ? "..." : expense.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Income</span>
                          <span className="text-xl font-bold text-emerald-500">
                            ₹{loading ? "..." : income.toLocaleString()}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Balance</span>
                            <span className={`text-lg font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              ₹{loading ? "..." : balance.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Charts Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {/* Expense Trends Chart */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="lg:col-span-2 xl:col-span-1"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3v18h18v-2H5V3H3zm16 16H7v-2h12v2zm0-4H9v-2h10v2zm0-4H11v-2h8v2z"/>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Expense Trends</h2>
                </div>
                <div className="h-64 flex items-center justify-center">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <span className="text-gray-500 dark:text-gray-400">Loading chart...</span>
                    </div>
                  ) : summary?.chartData?.length ? (
                    <div className="w-full h-full relative">
                      <svg width="100%" height="100%" viewBox="0 0 400 200">
                        <defs>
                          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        
                        {[...Array(5)].map((_, i) => (
                          <line 
                            key={i} 
                            x1="0" 
                            y1={i * 40} 
                            x2="400" 
                            y2={i * 40} 
                            stroke="#e5e7eb" 
                            strokeWidth="1"
                            opacity="0.3"
                          />
                        ))}
                        
                        {/* Chart area */}
                        <path
                          d={`M 0 ${160 - (summary.chartData[0]?.total || 0) / (Math.max(...summary.chartData.map((c:any)=>c.total)) || 1) * 140} ${summary.chartData.map((d:any, i:number) => {
                            const max = Math.max(...summary.chartData.map((c:any)=>c.total));
                            const x = (i * 380) / (summary.chartData.length - 1);
                            const y = 160 - (d.total / (max || 1)) * 140;
                            return `L ${x} ${y}`;
                          }).join(' ')} L 380 160 L 0 160 Z`}
                          fill="url(#chartGradient)"
                        />
                        
                        {/* Chart line */}
                        <path
                          d={`M 0 ${160 - (summary.chartData[0]?.total || 0) / (Math.max(...summary.chartData.map((c:any)=>c.total)) || 1) * 140} ${summary.chartData.map((d:any, i:number) => {
                            const max = Math.max(...summary.chartData.map((c:any)=>c.total));
                            const x = (i * 380) / (summary.chartData.length - 1);
                            const y = 160 - (d.total / (max || 1)) * 140;
                            return `L ${x} ${y}`;
                          }).join(' ')}`}
                          stroke="#3b82f6"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                        />
                        
                        {/* Data points */}
                        {summary.chartData.map((d:any, i:number) => {
                          const max = Math.max(...summary.chartData.map((c:any)=>c.total));
                          const x = (i * 380) / (summary.chartData.length - 1);
                          const y = 160 - (d.total / (max || 1)) * 140;
                          return (
                            <circle 
                              key={d._id} 
                              cx={x} 
                              cy={y} 
                              r={6} 
                              fill={d.type === "income" ? "#10b981" : "#ef4444"}
                              stroke="white"
                              strokeWidth="2"
                              className="hover:r-8 transition-all duration-200"
                            />
                          );
                        })}
                      </svg>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3v18h18v-2H5V3H3z"/>
                      </svg>
                      <p>No data available</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Category Pie Chart */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Categories</h2>
                </div>
                <div className="h-64 flex items-center justify-center">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <span className="text-gray-500 dark:text-gray-400">Loading chart...</span>
                    </div>
                  ) : summary?.categoryExpenses?.length ? (
                    <div className="w-full">
                      <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                        <defs>
                          {summary.categoryExpenses.map((c:any, i:number) => (
                            <linearGradient key={i} id={`gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={["#f87171", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa", "#f472b6", "#facc15", "#4ade80", "#38bdf8", "#818cf8", "#f9a8d4"][i % 11]}/>
                              <stop offset="100%" stopColor={["#dc2626", "#d97706", "#059669", "#2563eb", "#7c3aed", "#db2777", "#ca8a04", "#16a34a", "#0284c7", "#4f46e5", "#c026d3"][i % 11]}/>
                            </linearGradient>
                          ))}
                        </defs>
                        {(() => {
                          const total = summary.categoryExpenses.reduce((sum:any, c:any) => sum + c.total, 0);
                          let startAngle = 0;
                          return summary.categoryExpenses.map((c:any, i:number) => {
                            const angle = (c.total / total) * 2 * Math.PI;
                            const endAngle = startAngle + angle;
                            const x1 = 100 + 80 * Math.cos(startAngle);
                            const y1 = 100 + 80 * Math.sin(startAngle);
                            const x2 = 100 + 80 * Math.cos(endAngle);
                            const y2 = 100 + 80 * Math.sin(endAngle);
                            const largeArc = angle > Math.PI ? 1 : 0;
                            const pathData = `M100,100 L${x1},${y1} A80,80 0 ${largeArc},1 ${x2},${y2} Z`;
                            startAngle = endAngle;
                            return (
                              <path 
                                key={c._id} 
                                d={pathData} 
                                fill={`url(#gradient-${i})`}
                                className="hover:opacity-80 transition-opacity duration-200"
                              >
                                <title>{c._id}: ₹{c.total}</title>
                              </path>
                            );
                          });
                        })()}
                      </svg>
                      {/* Legend */}
                      <div className="mt-4 space-y-2 max-h-20 overflow-y-auto">
                        {summary?.categoryExpenses?.map((c:any, i:number) => (
                          <div key={c._id} className="flex items-center justify-between px-2 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: ["#f87171", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa", "#f472b6", "#facc15", "#4ade80", "#38bdf8", "#818cf8", "#f9a8d4"][i % 11] }}
                              />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{c._id}</span>
                            </div>
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">₹{c.total.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                      </svg>
                      <p>No category data</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Income vs Expense Chart */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 14l5-5 5 5z"/>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Income vs Expense</h2>
                </div>
                <div className="h-64 flex items-center justify-center">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <span className="text-gray-500 dark:text-gray-400">Loading chart...</span>
                    </div>
                  ) : summary?.incomeVsExpense?.length ? (
                    <div className="w-full">
                      <svg width="100%" height="200" viewBox="0 0 300 200">
                        <defs>
                          <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981"/>
                            <stop offset="100%" stopColor="#059669"/>
                          </linearGradient>
                          <linearGradient id="expenseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444"/>
                            <stop offset="100%" stopColor="#dc2626"/>
                          </linearGradient>
                        </defs>
                        {(() => {
                          const data = [
                            summary.incomeVsExpense.find((d:any) => d._id === "income"),
                            summary.incomeVsExpense.find((d:any) => d._id === "expense")
                          ];
                          const gradients = ["url(#incomeGradient)", "url(#expenseGradient)"];
                          const labels = ["Income", "Expense"];
                          const max = Math.max(...data.map((d:any)=>d?.total||0));
                          return data.map((d:any, i:number) => {
                            const barHeight = (d?.total||0)/(max||1)*140;
                            return (
                              <g key={labels[i]}>
                                <rect 
                                  x={60 + i*120} 
                                  y={160-barHeight} 
                                  width={60} 
                                  height={barHeight} 
                                  fill={gradients[i]} 
                                  rx="4"
                                  className="hover:opacity-80 transition-opacity duration-200"
                                />
                                <text 
                                  x={90 + i*120} 
                                  y={150-barHeight} 
                                  textAnchor="middle" 
                                  fontSize="12" 
                                  fill="#374151" 
                                  className="dark:fill-gray-300 font-semibold"
                                >
                                  ₹{(d?.total||0).toLocaleString()}
                                </text>
                                <text 
                                  x={90 + i*120} 
                                  y={180} 
                                  textAnchor="middle" 
                                  fontSize="14" 
                                  fill="#6b7280" 
                                  className="dark:fill-gray-400 font-medium"
                                >
                                  {labels[i]}
                                </text>
                              </g>
                            );
                          });
                        })()}
                      </svg>
                      
                      {/* Comparison metrics */}
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                          <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">Total Income</div>
                          <div className="text-emerald-700 dark:text-emerald-300 font-bold text-lg">
                            ₹{(summary.incomeVsExpense.find((d:any) => d._id === "income")?.total || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <div className="text-red-600 dark:text-red-400 font-semibold text-sm">Total Expense</div>
                          <div className="text-red-700 dark:text-red-300 font-bold text-lg">
                            ₹{(summary.incomeVsExpense.find((d:any) => d._id === "expense")?.total || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 14l5-5 5 5z"/>
                      </svg>
                      <p>No comparison data</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Recent Transactions Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            className="mt-8"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.5L15 15h5v5l-2.5-2.5z"/>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Recent Transactions</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  onClick={() => router.push("/entries")}
                >
                  View All
                </motion.button>
              </div>
              
              <div className="space-y-3">
                {entriesLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <span className="text-gray-500 dark:text-gray-400">Loading transactions...</span>
                    </div>
                  </div>
                ) : entries.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {entries.slice(0, 10).map((entry: any, index: number) => (
                      <motion.div
                        key={entry.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${
                            entry.type === 'income' 
                              ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                              : 'bg-red-100 dark:bg-red-900/30'
                          }`}>
                            {entry.type === 'income' ? (
                              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7 14l5-5 5 5z"/>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7 10l5 5 5-5z"/>
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                              {entry.description || 'Transaction'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {entry.category || 'General'} • {new Date(entry.date).toISOString().slice(0, 10)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            entry.type === 'income' 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {entry.type === 'income' ? '+' : '-'}₹{entry.amount?.toLocaleString() || 0}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {entry.type === 'income' ? 'Income' : 'Expense'}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                    <p className="text-lg font-medium">No transactions yet</p>
                    <p className="text-sm mt-1">Your recent transactions will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}