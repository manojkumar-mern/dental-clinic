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
} from "lucide-react";

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getCookieToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];
  };

  // 1. Verify Admin Session & Fetch Stats
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const token = getCookieToken();
        if (!token) {
          router.push("/admin/login");
          return;
        }

        // Fetch Session
        const sessionRes = await fetch("http://localhost:5000/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sessionData = await sessionRes.json();

        if (sessionRes.ok && sessionData.success) {
          setAdmin(sessionData.admin);

          // Fetch Stats
          const statsRes = await fetch("http://localhost:5000/api/stats/dashboard", {
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

  const handleLogout = () => {
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
    router.refresh();
  };

  if (loading || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b15] text-slate-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p>Verifying secure session...</p>
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#070b15]">
      {/* Side Navigation Bar */}
      <aside className="w-full md:w-64 bg-[#0a0f1d] border-b md:border-b-0 md:border-r border-white/[0.05] p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="size-8 rounded-lg bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow shadow-sky-500/10">
              A
            </div>
            <span className="font-semibold text-white tracking-wider uppercase text-sm">Aura Dental</span>
          </div>

          <nav className="space-y-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-sky-500/10 text-sky-400 text-sm font-medium transition-all"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/appointments"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.02] text-sm font-medium transition-all"
            >
              Appointments
            </Link>
            <Link
              href="/admin/patients"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.02] text-sm font-medium transition-all"
            >
              Patients
            </Link>
            <Link
              href="/admin/services"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.02] text-sm font-medium transition-all"
            >
              Services
            </Link>
            <Link
              href="/admin/messages"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.02] text-sm font-medium transition-all"
            >
              Messages
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.02] text-sm font-medium transition-all"
            >
              Settings
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/[0.05] mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sky-400 border border-white/[0.05]">
              {admin.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">{admin.name}</p>
              <p className="text-xs text-slate-400">{admin.role}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white border-white/[0.08]"
          >
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/[0.05] mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-slate-400 mt-1">Real-time indicators and management tools.</p>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="size-10 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 shrink-0">
              <Users className="size-5" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase block tracking-wider">Total Patients</span>
              <span className="text-2xl font-bold text-white mt-0.5 block">{metrics.totalPatients}</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Calendar className="size-5" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase block tracking-wider">Appointments</span>
              <span className="text-2xl font-bold text-white mt-0.5 block">{metrics.totalAppointments}</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="size-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
              <Layers className="size-5" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase block tracking-wider">Services</span>
              <span className="text-2xl font-bold text-white mt-0.5 block">{metrics.totalServices}</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
              <Activity className="size-5" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase block tracking-wider">Active Staff</span>
              <span className="text-2xl font-bold text-white mt-0.5 block">{metrics.totalDoctors}</span>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <CreditCard className="size-5" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase block tracking-wider">Revenue Est.</span>
              <span className="text-2xl font-bold text-white mt-0.5 block">${metrics.estimatedRevenue}</span>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Management Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Link
              href="/admin/appointments"
              className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] rounded-xl p-4 flex flex-col gap-2 transition-all group"
            >
              <PlusCircle className="size-5 text-sky-400" />
              <span className="font-semibold text-white text-sm">Schedule Appointment</span>
              <span className="text-xs text-slate-400">Add new patient booking slot</span>
            </Link>

            <Link
              href="/admin/services"
              className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] rounded-xl p-4 flex flex-col gap-2 transition-all group"
            >
              <Layers className="size-5 text-emerald-400" />
              <span className="font-semibold text-white text-sm">Manage Services</span>
              <span className="text-xs text-slate-400">Configure clinic treatments list</span>
            </Link>

            <Link
              href="/admin/messages"
              className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] rounded-xl p-4 flex flex-col gap-2 transition-all group"
            >
              <MessageSquare className="size-5 text-indigo-400" />
              <span className="font-semibold text-white text-sm">Read Message Inbox</span>
              <span className="text-xs text-slate-400">Review patient web contact inquiries</span>
            </Link>

            <Link
              href="/admin/settings"
              className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] rounded-xl p-4 flex flex-col gap-2 transition-all group"
            >
              <Settings className="size-5 text-amber-400" />
              <span className="font-semibold text-white text-sm">Update Settings</span>
              <span className="text-xs text-slate-400">Modify address, phone, and SEO info</span>
            </Link>
          </div>
        </section>

        {/* Dynamic Activity Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left panel: Recent Bookings & Messages */}
          <div className="lg:col-span-7 space-y-8">
            {/* Appointments */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-white">Recent Consultation Bookings</h3>
                <Link href="/admin/appointments" className="text-xs text-sky-400 hover:underline flex items-center gap-1">
                  View All <ArrowRight className="size-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {!stats?.recentAppointments || stats.recentAppointments.length === 0 ? (
                  <p className="text-xs text-slate-500">No appointments recorded.</p>
                ) : (
                  stats.recentAppointments.map((appt) => (
                    <div
                      key={appt._id}
                      className="p-3 bg-white/[0.01] border border-white/[0.03] rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{appt.patient?.name || "Anonymous"}</p>
                        <p className="text-xs text-slate-400">
                          {appt.service?.title || "Consultation"} • {appt.preferredTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${
                            appt.status === "Confirmed"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : appt.status === "Pending"
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-slate-500/10 text-slate-400"
                          }`}
                        >
                          {appt.status}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {new Date(appt.preferredDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-white">Recent Visitor Inquiries</h3>
                <Link href="/admin/messages" className="text-xs text-sky-400 hover:underline flex items-center gap-1">
                  View All <ArrowRight className="size-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {!stats?.recentMessages || stats.recentMessages.length === 0 ? (
                  <p className="text-xs text-slate-500">No contact messages recorded.</p>
                ) : (
                  stats.recentMessages.map((msg) => (
                    <div
                      key={msg._id}
                      className="p-3 bg-white/[0.01] border border-white/[0.03] rounded-lg flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">{msg.name}</p>
                          <span
                            className={`px-1.5 py-0.5 text-[9px] rounded-full font-bold uppercase ${
                              msg.status === "New" ? "bg-amber-500/10 text-amber-400" : "bg-slate-500/10 text-slate-400"
                            }`}
                          >
                            {msg.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5 font-medium">{msg.subject}</p>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-1">{msg.message}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 self-start">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right panel: Activity Logs */}
          <div className="lg:col-span-5">
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 shadow-sm h-full flex flex-col justify-between">
              <div>
                <h3 className="text-base font-semibold text-white mb-4">System Activity Logs</h3>
                <div className="space-y-4">
                  {!stats?.recentLogs || stats.recentLogs.length === 0 ? (
                    <p className="text-xs text-slate-500">No activity logged.</p>
                  ) : (
                    stats.recentLogs.map((log) => (
                      <div key={log._id} className="text-xs flex gap-3 items-start border-l border-white/[0.08] pl-3">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-200 uppercase tracking-wide text-[10px] text-sky-400">
                            {log.action.replace(/_/g, " ")}
                          </p>
                          <p className="text-slate-300 mt-0.5">{log.details}</p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                            <span>By: {log.user?.name || "Admin"}</span>
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
      </main>
    </div>
  );
}
