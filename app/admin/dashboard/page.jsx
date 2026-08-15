"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import {
  Users,
  Calendar,
  Phone,
  Activity,
  Settings,
  PlusCircle,
  CreditCard,
  Layers,
  ArrowRight,
  MessageSquare,
  TrendingUp,
  PieChart as PieIcon,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  UserCheck
} from "lucide-react";

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const router = useRouter();

  const getCookieToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const token = getCookieToken();
        if (!token) {
          router.push("/admin/login");
          return;
        }

        // Fetch Session
        const sessionRes = await fetch(`${API_BASE_URL}/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sessionData = await sessionRes.json();

        if (sessionRes.ok && sessionData.success) {
          setAdmin(sessionData.admin);

          // Fetch Stats
          const statsRes = await fetch(`${API_BASE_URL}/stats/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const statsData = await statsRes.json();
          if (statsRes.ok && statsData.success) {
            setStats(statsData.data);
          }
        } else {
          router.push("/admin/login");
        }
      } catch (err) {
        console.error("Dashboard init error:", err);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [router]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-600 dark:text-slate-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-sm font-medium tracking-wide">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const metrics = stats?.metrics || {
    totalPatients: 0,
    totalDoctors: 0,
    totalServices: 0,
    totalAppointments: 0,
    estimatedRevenue: 0,
  };

  // ----------------------------------------------------
  // Interactive SVG Chart Data & Helper Calculations
  // ----------------------------------------------------
  
  // 1. Line/Area Chart: Weekly Appointments
  const weeklyData = [
    { day: "Mon", count: 4 },
    { day: "Tue", count: 8 },
    { day: "Wed", count: 5 },
    { day: "Thu", count: 12 },
    { day: "Fri", count: 9 },
    { day: "Sat", count: 15 },
    { day: "Sun", count: 6 },
  ];
  
  const chartHeight = 120;
  const chartWidth = 500;
  const maxVal = Math.max(...weeklyData.map(d => d.count), 10) + 2;
  
  // Generate points for SVG Path
  const points = weeklyData.map((d, index) => {
    const x = (index / (weeklyData.length - 1)) * chartWidth;
    const y = chartHeight - (d.count / maxVal) * chartHeight;
    return { x, y, ...d };
  });
  
  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");
  
  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  // 2. Donut/Pie Chart: Service Category Splits
  const donutData = [
    { name: "Preventative", value: 35, color: "#0ea5e9" }, // sky-500
    { name: "Cosmetic", value: 25, color: "#10b981" },     // emerald-500
    { name: "Orthodontics", value: 20, color: "#6366f1" }, // indigo-500
    { name: "Restorative", value: 20, color: "#a855f7" },  // purple-500
  ];
  
  let accumulatedPercent = 0;
  const donutSlices = donutData.map((slice) => {
    const startPercent = accumulatedPercent;
    accumulatedPercent += slice.value;
    
    // Convert percentage to coordinates
    const getCoordinatesForPercent = (percent) => {
      const x = Math.cos(2 * Math.PI * percent);
      const y = Math.sin(2 * Math.PI * percent);
      return [x, y];
    };
    
    const [startX, startY] = getCoordinatesForPercent(startPercent / 100);
    const [endX, endY] = getCoordinatesForPercent(accumulatedPercent / 100);
    const largeArcFlag = slice.value > 50 ? 1 : 0;
    
    // Path definition for dynamic SVG arc
    const pathData = [
      `M ${startX} ${startY}`,
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `L 0 0`,
    ].join(" ");
    
    return { ...slice, pathData };
  });

  return (
    <div className="w-full">
      
      
      <div className="w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200 dark:border-white/[0.05] mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Real-time indicators, operational metrics, and charts.</p>
          </div>
          <Link
            href="/admin/appointments"
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-slate-900 dark:text-white rounded-xl text-sm font-bold shadow-lg shadow-sky-500/20 transition-all hover:-translate-y-0.5"
          >
            <PlusCircle className="size-4" />
            Book Appointment
          </Link>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          {/* Card 1 */}
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-5 flex items-center gap-4 hover:border-sky-500/30 transition-all hover:bg-white/[0.03] group">
            <div className="size-11 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform shrink-0">
              <Users className="size-5.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest block">Total Patients</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 block">{metrics.totalPatients}</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-5 flex items-center gap-4 hover:border-emerald-500/30 transition-all hover:bg-white/[0.03] group">
            <div className="size-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
              <Calendar className="size-5.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest block">Appointments</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 block">{metrics.totalAppointments}</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-5 flex items-center gap-4 hover:border-indigo-500/30 transition-all hover:bg-white/[0.03] group">
            <div className="size-11 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
              <Layers className="size-5.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest block">Services Offered</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 block">{metrics.totalServices}</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-5 flex items-center gap-4 hover:border-purple-500/30 transition-all hover:bg-white/[0.03] group">
            <div className="size-11 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shrink-0">
              <UserCheck className="size-5.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest block">Active Doctors</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 block">{metrics.totalDoctors}</span>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-5 flex items-center gap-4 hover:border-amber-500/30 transition-all hover:bg-white/[0.03] group">
            <div className="size-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
              <CreditCard className="size-5.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest block">Revenue Est.</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 block">${metrics.estimatedRevenue}</span>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Chart 1: Appointments Trend (SVG Area Chart) */}
          <div className="lg:col-span-2 bg-[#0a0f1d] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-sky-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Weekly Appointment Volume</h3>
                </div>
                <span className="text-[11px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full uppercase">Live Feed</span>
              </div>
              
              {/* Responsive SVG Area Chart */}
              <div className="relative w-full h-[150px] mt-4 select-none">
                <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => (
                    <line
                      key={idx}
                      x1="0"
                      y1={chartHeight * r}
                      x2={chartWidth}
                      y2={chartHeight * r}
                      stroke="rgba(255,255,255,0.03)"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Gradient Area Fill */}
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d={areaD} fill="url(#areaGrad)" />
                  
                  {/* Curve Path Line */}
                  <path d={pathD} fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" />
                  
                  {/* Points Dots */}
                  {points.map((p, idx) => (
                    <circle
                      key={idx}
                      cx={p.x}
                      cy={p.y}
                      r={activeTooltip === idx ? "6.5" : "4"}
                      fill={activeTooltip === idx ? "#ffffff" : "#0ea5e9"}
                      stroke="#070b15"
                      strokeWidth="2"
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setActiveTooltip(idx)}
                      onMouseLeave={() => setActiveTooltip(null)}
                    />
                  ))}
                </svg>

                {/* Tooltip Popup on Active Hover */}
                {activeTooltip !== null && (
                  <div
                    className="absolute bg-slate-900 border border-white/10 rounded-lg p-2 text-[10px] shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full"
                    style={{
                      left: `${(activeTooltip / (weeklyData.length - 1)) * 100}%`,
                      top: `${points[activeTooltip].y - 8}px`
                    }}
                  >
                    <p className="font-bold text-slate-900 dark:text-white">{points[activeTooltip].day}</p>
                    <p className="text-sky-400 font-semibold">{points[activeTooltip].count} slots booked</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chart X-Axis Labels */}
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-500 font-bold px-1.5 pt-4 mt-2 border-t border-slate-200 dark:border-white/[0.03]">
              {weeklyData.map((d, i) => (
                <span key={i}>{d.day}</span>
              ))}
            </div>
          </div>

          {/* Chart 2: Revenue Category Splits (SVG Donut Chart) */}
          <div className="bg-[#0a0f1d] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <PieIcon className="size-4 text-emerald-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Service Allocation</h3>
              </div>
            </div>

            {/* Circular Donut Layout */}
            <div className="relative flex justify-center items-center h-[130px] my-2">
              <svg className="w-[120px] h-[120px] transform -rotate-90" viewBox="-1.1 -1.1 2.2 2.2">
                {donutSlices.map((slice, idx) => (
                  <path
                    key={idx}
                    d={slice.pathData}
                    fill={slice.color}
                    className="transition-all hover:opacity-85 cursor-pointer"
                  />
                ))}
                {/* Center Cutout for Donut look */}
                <circle cx="0" cy="0" r="0.72" fill="#0a0f1d" />
              </svg>
              
              {/* Inside Donut Center content */}
              <div className="absolute text-center">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 block uppercase tracking-wider">Services</span>
                <span className="text-lg font-black text-slate-900 dark:text-white leading-none">100%</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 dark:text-slate-400 font-semibold pt-4 mt-2 border-t border-slate-200 dark:border-white/[0.03]">
              {donutData.map((d, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                  <span className="truncate">{d.name} ({d.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Actions Panel */}
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-4">Quick Management Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Link
              href="/admin/appointments"
              className="bg-white dark:bg-white/[0.01] hover:bg-white/[0.03] border border-slate-200 dark:border-white/[0.04] rounded-2xl p-4 flex flex-col gap-2.5 transition-all group hover:-translate-y-0.5 hover:border-sky-500/20"
            >
              <PlusCircle className="size-5 text-sky-400" />
              <span className="font-semibold text-slate-900 dark:text-white text-sm">Schedule Appointment</span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">Add new patient booking slot</span>
            </Link>

            <Link
              href="/admin/services"
              className="bg-white dark:bg-white/[0.01] hover:bg-white/[0.03] border border-slate-200 dark:border-white/[0.04] rounded-2xl p-4 flex flex-col gap-2.5 transition-all group hover:-translate-y-0.5 hover:border-emerald-500/20"
            >
              <Layers className="size-5 text-emerald-400" />
              <span className="font-semibold text-slate-900 dark:text-white text-sm">Manage Services</span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">Configure clinic treatments list</span>
            </Link>

            <Link
              href="/admin/messages"
              className="bg-white dark:bg-white/[0.01] hover:bg-white/[0.03] border border-slate-200 dark:border-white/[0.04] rounded-2xl p-4 flex flex-col gap-2.5 transition-all group hover:-translate-y-0.5 hover:border-indigo-500/20"
            >
              <MessageSquare className="size-5 text-indigo-400" />
              <span className="font-semibold text-slate-900 dark:text-white text-sm">Read Message Inbox</span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">Review patient web contact inquiries</span>
            </Link>

            <Link
              href="/admin/settings"
              className="bg-white dark:bg-white/[0.01] hover:bg-white/[0.03] border border-slate-200 dark:border-white/[0.04] rounded-2xl p-4 flex flex-col gap-2.5 transition-all group hover:-translate-y-0.5 hover:border-amber-500/20"
            >
              <Settings className="size-5 text-amber-400" />
              <span className="font-semibold text-slate-900 dark:text-white text-sm">Update Settings</span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">Modify address, phone, and SEO info</span>
            </Link>
          </div>
        </section>

        {/* Data Activity Panels & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left panel: Recent Bookings Table */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="size-4.5 text-sky-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Recent Consultation Bookings</h3>
                </div>
                <Link href="/admin/appointments" className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-bold">
                  View All <ArrowRight className="size-3" />
                </Link>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/[0.05] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-wider">
                      <th className="pb-3.5 pl-3">Patient</th>
                      <th className="pb-3.5">Service</th>
                      <th className="pb-3.5">Date & Time</th>
                      <th className="pb-3.5 text-center">Status</th>
                      <th className="pb-3.5 pr-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!stats?.recentAppointments || stats.recentAppointments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-6 text-center text-slate-500 dark:text-slate-500 font-medium">No recent appointments recorded.</td>
                      </tr>
                    ) : (
                      stats.recentAppointments.map((appt) => (
                        <tr key={appt._id} className="border-b border-slate-200 dark:border-white/[0.03] hover:bg-white/[0.01] transition-all">
                          <td className="py-3.5 pl-3">
                            <span className="font-semibold text-slate-900 dark:text-white block text-sm">{appt.patient?.name || "Anonymous"}</span>
                            <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-0.5">{appt.patient?.phone || "No phone"}</span>
                          </td>
                          <td className="py-3.5 text-slate-700 dark:text-slate-300 font-medium">{appt.service?.title || "Consultation"}</td>
                          <td className="py-3.5">
                            <span className="text-slate-700 dark:text-slate-300 font-medium block">{new Date(appt.preferredDate).toLocaleDateString()}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-500 block mt-0.5">{appt.preferredTime}</span>
                          </td>
                          <td className="py-3.5 text-center">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                appt.status === "Confirmed"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : appt.status === "Pending"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20"
                              }`}
                            >
                              {appt.status}
                            </span>
                          </td>
                          <td className="py-3.5 pr-3 text-right">
                            <Link
                              href={`/admin/appointments`}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-400 hover:text-sky-300"
                            >
                              Manage <ArrowUpRight className="size-3" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inquiries */}
            <div className="bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="size-4.5 text-indigo-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Recent Inquiries</h3>
                </div>
                <Link href="/admin/messages" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold">
                  View All <ArrowRight className="size-3" />
                </Link>
              </div>

              <div className="space-y-3.5">
                {!stats?.recentMessages || stats.recentMessages.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-500 text-center py-4 font-medium">No contact messages recorded.</p>
                ) : (
                  stats.recentMessages.map((msg) => (
                    <div
                      key={msg._id}
                      className="p-4 bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/[0.03] rounded-xl flex justify-between items-start hover:border-white/[0.06] transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{msg.name}</p>
                          <span
                            className={`px-2 py-0.5 text-[9px] rounded-full font-bold uppercase tracking-wider ${
                              msg.status === "New" 
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/15" 
                                : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/15"
                            }`}
                          >
                            {msg.status}
                          </span>
                        </div>
                        <p className="text-xs text-sky-400 mt-1 font-semibold">{msg.subject}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-1 leading-normal font-medium">{msg.message}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-500 self-start font-bold">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right panel: Activity Logs */}
          <div className="lg:col-span-4">
            <div className="bg-[#0a0f1d] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <ShieldCheck className="size-4.5 text-sky-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Security Activity Logs</h3>
                </div>
                
                <div className="space-y-5">
                  {!stats?.recentLogs || stats.recentLogs.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-500 text-center py-4 font-medium">No activity logged.</p>
                  ) : (
                    stats.recentLogs.map((log) => (
                      <div key={log._id} className="text-xs flex gap-3.5 items-start border-l-2 border-slate-300 dark:border-white/[0.08] pl-3.5 hover:border-sky-500/40 transition-all py-0.5">
                        <div className="flex-1">
                          <p className="font-extrabold text-[10px] text-sky-400 uppercase tracking-widest leading-none">
                            {log.action.replace(/_/g, " ")}
                          </p>
                          <p className="text-slate-700 dark:text-slate-300 mt-1.5 leading-normal font-medium">{log.details}</p>
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 dark:text-slate-500 font-bold">
                            <span>By: {log.user?.name || "System"}</span>
                            <span>•</span>
                            <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
