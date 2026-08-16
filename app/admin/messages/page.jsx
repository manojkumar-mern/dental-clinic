"use client";
import { API_BASE_URL } from "@/lib/api";

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

        const response = await fetch(`${API_BASE_URL}/admin/me`, {
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
        `${API_BASE_URL}/contact-messages?search=${search}&status=${statusFilter}&page=${page}&limit=5`,
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
      const response = await fetch(`${API_BASE_URL}/contact-messages/${id}/read`, {
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
      const response = await fetch(`${API_BASE_URL}/contact-messages/${id}`, {
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
      <div className="min-h-screen flex items-center justify-center bg-[#070b15] text-slate-600 dark:text-slate-400">
        <p>Loading secure session...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      
      <div className="w-full">
        <header className="pb-6 border-b border-slate-200 dark:border-white/[0.05] mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Contact Messages</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Review contact inquiries submitted by website visitors.</p>
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
            className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.08] text-slate-900 dark:text-white"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] px-4 text-sm transition-all focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/15 outline-none text-slate-900 dark:text-white h-[46px]"
          >
            <option value="" className="bg-[#070b15] text-slate-900 dark:text-white">All Statuses</option>
            <option value="New" className="bg-[#070b15] text-slate-900 dark:text-white">New</option>
            <option value="Read" className="bg-[#070b15] text-slate-900 dark:text-white">Read</option>
          </select>
        </div>

        {/* Messages Table */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.01] text-slate-600 dark:text-slate-400 font-semibold">
                  <th className="p-4">Sender Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Received Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-slate-700 dark:text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500 dark:text-slate-500">
                      Loading message logs...
                    </td>
                  </tr>
                ) : messages.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500 dark:text-slate-500">
                      No messages matching criteria.
                    </td>
                  </tr>
                ) : (
                  messages.map((msg) => (
                    <tr key={msg._id} className="hover:bg-white/[0.01] transition-all">
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">{msg.name}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{msg.email}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{msg.phone || "—"}</td>
                      <td className="p-4 text-slate-700 dark:text-slate-300">{msg.subject}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            msg.status === "New"
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                              : "bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {msg.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          onClick={() => openDetailsModal(msg)}
                          variant="outline"
                          size="sm"
                          className="text-xs border-slate-300 dark:border-white/[0.08] hover:bg-white/[0.02]"
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
            <div className="p-4 border-t border-slate-200 dark:border-white/[0.05] flex justify-between items-center bg-white dark:bg-white/[0.01]">
              <Button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                variant="outline"
                size="sm"
                className="text-xs border-slate-300 dark:border-white/[0.08]"
              >
                Previous
              </Button>
              <span className="text-xs text-slate-500 dark:text-slate-500">
                Page {page} of {totalPages}
              </span>
              <Button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                variant="outline"
                size="sm"
                className="text-xs border-slate-300 dark:border-white/[0.08]"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Message Reader Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedMsg ? `Contact Inquiry Details` : ""}
        className="bg-[#0a0f1d] border-slate-300 dark:border-white/[0.08] text-slate-900 dark:text-white"
        size="md"
      >
        {selectedMsg && (
          <div className="space-y-6">
            {/* Sender Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-white/[0.05] pb-4">
              <div>
                <span className="text-slate-500 dark:text-slate-500 font-medium block">Sender Name:</span>
                <span className="text-slate-900 dark:text-white font-semibold">{selectedMsg.name}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-500 font-medium block">Subject:</span>
                <span className="text-slate-900 dark:text-white font-semibold">{selectedMsg.subject}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-500 font-medium block">Sender Email:</span>
                <span className="text-slate-900 dark:text-white">{selectedMsg.email}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-500 font-medium block">Phone Number:</span>
                <span className="text-slate-900 dark:text-white">{selectedMsg.phone || "—"}</span>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <span className="text-slate-500 dark:text-slate-500 text-sm font-medium block mb-2">Message Content:</span>
              <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-lg p-4 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selectedMsg.message}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/[0.05] flex justify-between items-center gap-3">
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
                    className="bg-emerald-600 hover:bg-emerald-500 text-slate-900 dark:text-white text-xs font-semibold"
                  >
                    Mark as Read
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="border-slate-300 dark:border-white/[0.08] hover:bg-white/[0.02] text-xs"
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
