"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";

export default function AdminMessagesPage() {
  const [admin, setAdmin] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const router = useRouter();

  const getCookieToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];
  };

  // 1. Fetch Admin Session
  useEffect(() => {
    const fetchAdminSession = async () => {
      try {
        const token = getCookieToken();
        if (!token) {
          router.push("/admin/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setAdmin(data.admin);
        } else {
          router.push("/admin/login");
        }
      } catch (err) {
        router.push("/admin/login");
      }
    };

    fetchAdminSession();
  }, [router]);

  // 2. Fetch Messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = getCookieToken();
      const response = await fetch(
        `http://localhost:5000/api/contact-messages?search=${search}&status=${statusFilter}&page=${page}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setMessages(data.messages);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchMessages();
    }
  }, [search, statusFilter, page, admin]);

  // Logout Handler
  const handleLogout = () => {
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
    router.refresh();
  };

  // Open Details Modal
  const openDetailsModal = (msg) => {
    setSelectedMsg(msg);
    setIsModalOpen(true);
  };

  // Mark message as Read
  const handleMarkAsRead = async (id) => {
    setActionLoading(true);
    const token = getCookieToken();
    try {
      const response = await fetch(`http://localhost:5000/api/contact-messages/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedMsg(data.data);
        fetchMessages();
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete message
  const handleDeleteMessage = async (id) => {
    if (!confirm("Are you sure you want to delete this contact message?")) return;

    setActionLoading(true);
    const token = getCookieToken();
    try {
      const response = await fetch(`http://localhost:5000/api/contact-messages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchMessages();
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b15] text-slate-400">
        <p>Loading secure session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#070b15]">
      {/* Side Navigation Bar */}
      <aside className="w-full md:w-64 bg-[#0a0f1d] border-b md:border-b-0 md:border-r border-white/[0.05] p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="size-8 rounded-lg bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="font-semibold text-white tracking-wider uppercase text-sm">Aura Dental</span>
          </div>

          <nav className="space-y-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.02] text-sm font-medium transition-all"
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
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-sky-500/10 text-sky-400 text-sm font-medium transition-all"
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
        <header className="pb-6 border-b border-white/[0.05] mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Contact Messages</h1>
          <p className="text-slate-400 mt-1">Review contact inquiries submitted by website visitors.</p>
        </header>

        {/* Filters Panel */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
          <Input
            placeholder="Search by Sender Name, Email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="bg-white/[0.02] border-white/[0.08] text-white"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 text-sm transition-all focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/15 outline-none text-white h-[46px]"
          >
            <option value="" className="bg-[#070b15] text-white">All Statuses</option>
            <option value="New" className="bg-[#070b15] text-white">New</option>
            <option value="Read" className="bg-[#070b15] text-white">Read</option>
          </select>
        </div>

        {/* Messages Table */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/[0.05] bg-white/[0.01] text-slate-400 font-semibold">
                  <th className="p-4">Sender Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Received Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500">
                      Loading message logs...
                    </td>
                  </tr>
                ) : messages.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500">
                      No messages matching criteria.
                    </td>
                  </tr>
                ) : (
                  messages.map((msg) => (
                    <tr key={msg._id} className="hover:bg-white/[0.01] transition-all">
                      <td className="p-4 font-semibold text-white">{msg.name}</td>
                      <td className="p-4 text-slate-400">{msg.email}</td>
                      <td className="p-4 text-slate-400">{msg.phone || "—"}</td>
                      <td className="p-4 text-slate-300">{msg.subject}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            msg.status === "New"
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                              : "bg-slate-500/10 border-slate-500/20 text-slate-400"
                          }`}
                        >
                          {msg.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          onClick={() => openDetailsModal(msg)}
                          variant="outline"
                          size="sm"
                          className="text-xs border-white/[0.08] hover:bg-white/[0.02]"
                        >
                          Read Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
              <Button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                variant="outline"
                size="sm"
                className="text-xs border-white/[0.08]"
              >
                Previous
              </Button>
              <span className="text-xs text-slate-500">
                Page {page} of {totalPages}
              </span>
              <Button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                variant="outline"
                size="sm"
                className="text-xs border-white/[0.08]"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Message Reader Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedMsg ? `Contact Inquiry Details` : ""}
        className="bg-[#0a0f1d] border-white/[0.08] text-white"
        size="md"
      >
        {selectedMsg && (
          <div className="space-y-6">
            {/* Sender Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-300 border-b border-white/[0.05] pb-4">
              <div>
                <span className="text-slate-500 font-medium block">Sender Name:</span>
                <span className="text-white font-semibold">{selectedMsg.name}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Subject:</span>
                <span className="text-white font-semibold">{selectedMsg.subject}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Sender Email:</span>
                <span className="text-white">{selectedMsg.email}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Phone Number:</span>
                <span className="text-white">{selectedMsg.phone || "—"}</span>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <span className="text-slate-500 text-sm font-medium block mb-2">Message Content:</span>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selectedMsg.message}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/[0.05] flex justify-between items-center gap-3">
              <Button
                disabled={actionLoading}
                onClick={() => handleDeleteMessage(selectedMsg._id)}
                variant="destructive"
                className="text-xs"
              >
                Delete Message
              </Button>

              <div className="flex gap-2">
                {selectedMsg.status === "New" && (
                  <Button
                    disabled={actionLoading}
                    onClick={() => handleMarkAsRead(selectedMsg._id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                  >
                    Mark as Read
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="border-white/[0.08] hover:bg-white/[0.02] text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
