"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import Textarea from "@/components/ui/textarea";

export default function AdminAppointmentsPage() {
  const [admin, setAdmin] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);

  // Reschedule / edit states inside modal
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");
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

  // 2. Fetch Appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = getCookieToken();
      const response = await fetch(
        `http://localhost:5000/api/appointments?search=${search}&status=${statusFilter}&date=${dateFilter}&page=${page}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setAppointments(data.appointments);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Failed to load appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchAppointments();
    }
  }, [search, statusFilter, dateFilter, page, admin]);

  // Logout Handler
  const handleLogout = () => {
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
    router.refresh();
  };

  // Open Details Modal
  const openDetailsModal = (appt) => {
    setSelectedAppt(appt);
    setPreferredDate(appt.preferredDate ? appt.preferredDate.substring(0, 10) : "");
    setPreferredTime(appt.preferredTime || "");
    setAdminNotes(appt.adminNotes || "");
    setModalError("");
    setModalSuccess("");
    setIsModalOpen(true);
  };

  // Change Status
  const handleStatusChange = async (newStatus) => {
    setActionLoading(true);
    setModalError("");
    setModalSuccess("");

    const token = getCookieToken();
    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${selectedAppt._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update status.");
      }

      setModalSuccess(`Appointment status changed to ${newStatus}.`);
      setSelectedAppt(data.appointment);
      fetchAppointments();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Reschedule and Update Notes
  const handleRescheduleAndNotes = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setModalError("");
    setModalSuccess("");

    const token = getCookieToken();
    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${selectedAppt._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            preferredDate,
            preferredTime,
            adminNotes,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to reschedule.");
      }

      setModalSuccess("Appointment rescheduled and notes updated successfully.");
      setSelectedAppt(data.appointment);
      fetchAppointments();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Soft Delete Appointment
  const handleDeleteAppointment = async (id) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    const token = getCookieToken();
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchAppointments();
      }
    } catch (err) {
      console.error("Failed to delete appointment:", err);
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Appointments Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Review, reschedule, confirm and cancel patient consultations.</p>
        </header>

        {/* Filters Panel */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
          <Input
            placeholder="Search by ID, Patient Name..."
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
            <option value="Pending" className="bg-[#070b15] text-slate-900 dark:text-white">Pending</option>
            <option value="Confirmed" className="bg-[#070b15] text-slate-900 dark:text-white">Confirmed</option>
            <option value="Completed" className="bg-[#070b15] text-slate-900 dark:text-white">Completed</option>
            <option value="Cancelled" className="bg-[#070b15] text-slate-900 dark:text-white">Cancelled</option>
          </select>

          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setPage(1);
            }}
            className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.08] text-slate-900 dark:text-white h-[46px]"
          />
        </div>

        {/* Appointments Table */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.01] text-slate-600 dark:text-slate-400 font-semibold">
                  <th className="p-4">Appt ID</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-slate-700 dark:text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-slate-500 dark:text-slate-500">
                      Loading appointments list...
                    </td>
                  </tr>
                ) : appointments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-slate-500 dark:text-slate-500">
                      No appointments found matching parameters.
                    </td>
                  </tr>
                ) : (
                  appointments.map((appt) => (
                    <tr key={appt._id} className="hover:bg-white/[0.01] transition-all">
                      <td className="p-4 font-semibold text-sky-400">{appt.appointmentId}</td>
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">
                        {appt.patient ? appt.patient.name : "Unknown"}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        {appt.patient ? appt.patient.phone : "Unknown"}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        {appt.service ? appt.service.title : "Unknown"}
                      </td>
                      <td className="p-4 text-slate-900 dark:text-white">
                        {new Date(appt.preferredDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{appt.preferredTime}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            appt.status === "Confirmed"
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : appt.status === "Pending"
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                              : appt.status === "Completed"
                              ? "bg-sky-500/10 border-sky-500/20 text-sky-400"
                              : "bg-red-500/10 border-red-500/20 text-red-400"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          onClick={() => openDetailsModal(appt)}
                          variant="outline"
                          size="sm"
                          className="text-xs border-slate-300 dark:border-white/[0.08] hover:bg-white/[0.02]"
                        >
                          View Details
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

      {/* Appointment Detail & Management Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAppt ? `Manage Appointment: ${selectedAppt.appointmentId}` : ""}
        className="bg-[#0a0f1d] border-slate-300 dark:border-white/[0.08] text-slate-900 dark:text-white"
        size="lg"
      >
        {selectedAppt && (
          <div className="space-y-6">
            {modalError && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {modalError}
              </div>
            )}

            {modalSuccess && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                {modalSuccess}
              </div>
            )}

            {/* Status indicators */}
            <div className="flex flex-wrap gap-2 items-center pb-4 border-b border-slate-200 dark:border-white/[0.05]">
              <span className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Status Transitions:
              </span>
              <Button
                disabled={actionLoading || selectedAppt.status === "Confirmed"}
                onClick={() => handleStatusChange("Confirmed")}
                className="py-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-slate-900 dark:text-white text-xs rounded-md font-semibold"
              >
                Confirm
              </Button>
              <Button
                disabled={actionLoading || selectedAppt.status === "Completed"}
                onClick={() => handleStatusChange("Completed")}
                className="py-1 px-3 bg-sky-600 hover:bg-sky-500 text-slate-900 dark:text-white text-xs rounded-md font-semibold"
              >
                Complete
              </Button>
              <Button
                disabled={actionLoading || selectedAppt.status === "Cancelled"}
                onClick={() => handleStatusChange("Cancelled")}
                className="py-1 px-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs rounded-md font-semibold"
              >
                Cancel
              </Button>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-700 dark:text-slate-300">
              <div>
                <span className="text-slate-500 dark:text-slate-500 font-medium block">Patient:</span>
                <span className="text-slate-900 dark:text-white font-semibold">
                  {selectedAppt.patient ? selectedAppt.patient.name : "Unknown"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-500 font-medium block">Mobile Phone:</span>
                <span className="text-slate-900 dark:text-white">
                  {selectedAppt.patient ? selectedAppt.patient.phone : "Unknown"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-500 font-medium block">Care Service:</span>
                <span className="text-slate-900 dark:text-white font-semibold">
                  {selectedAppt.service ? selectedAppt.service.title : "Unknown"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-500 font-medium block">Reason for Visit:</span>
                <span className="text-slate-900 dark:text-white italic">
                  {selectedAppt.reasonForVisit || "Not specified"}
                </span>
              </div>
            </div>

            {/* Reschedule Form */}
            <form onSubmit={handleRescheduleAndNotes} className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/[0.05]">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Reschedule & Notes</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Preferred Date"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    required
                    className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1.5">
                    Preferred Time Slot
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 dark:border-white/[0.1] bg-white dark:bg-white/[0.02] px-4 py-3 text-sm transition-all focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/15 outline-none text-slate-900 dark:text-white h-[46px]"
                  >
                    <option value="09:00 AM" className="bg-[#0a0f1d] text-slate-900 dark:text-white">09:00 AM</option>
                    <option value="10:00 AM" className="bg-[#0a0f1d] text-slate-900 dark:text-white">10:00 AM</option>
                    <option value="11:00 AM" className="bg-[#0a0f1d] text-slate-900 dark:text-white">11:00 AM</option>
                    <option value="12:00 PM" className="bg-[#0a0f1d] text-slate-900 dark:text-white">12:00 PM</option>
                    <option value="02:00 PM" className="bg-[#0a0f1d] text-slate-900 dark:text-white">02:00 PM</option>
                    <option value="03:00 PM" className="bg-[#0a0f1d] text-slate-900 dark:text-white">03:00 PM</option>
                    <option value="04:00 PM" className="bg-[#0a0f1d] text-slate-900 dark:text-white">04:00 PM</option>
                    <option value="05:00 PM" className="bg-[#0a0f1d] text-slate-900 dark:text-white">05:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <Textarea
                  label="Administrative Notes"
                  placeholder="Record rescheduling history, clinical warnings, or coordinators' updates..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/[0.05] flex justify-between gap-3">
                <Button
                  type="button"
                  onClick={() => handleDeleteAppointment(selectedAppt._id)}
                  variant="destructive"
                  className="text-xs"
                >
                  Delete Appointment
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    variant="outline"
                    className="border-slate-300 dark:border-white/[0.08] hover:bg-white/[0.02]"
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-sky-500 hover:bg-sky-400 text-slate-900 dark:text-white font-semibold"
                  >
                    {actionLoading ? "Saving..." : "Save Reschedule"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
