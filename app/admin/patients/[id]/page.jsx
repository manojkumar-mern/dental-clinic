"use client";
import { API_BASE_URL } from "@/lib/api";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";

export default function AdminPatientDetailPage({ params }) {
  // Use React.use() to unwrap the dynamic route params in Next.js 15+
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [admin, setAdmin] = useState(null);
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Notes edit state
  const [notes, setNotes] = useState("");
  const [updatingNotes, setUpdatingNotes] = useState(false);
  const [notesMessage, setNotesMessage] = useState("");

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

  // 2. Fetch Patient Details
  const fetchPatientDetails = async () => {
    setLoading(true);
    try {
      const token = getCookieToken();
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setPatient(data.patient);
        setNotes(data.patient.notes || "");
        setAppointments(data.appointments || []);
      } else {
        router.push("/admin/patients");
      }
    } catch (err) {
      console.error("Failed to load patient:", err);
      router.push("/admin/patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin && id) {
      fetchPatientDetails();
    }
  }, [admin, id]);

  // Update Notes
  const handleUpdateNotes = async (e) => {
    e.preventDefault();
    setUpdatingNotes(true);
    setNotesMessage("");

    const token = getCookieToken();
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: patient.name,
          phone: patient.phone,
          notes,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setNotesMessage("Notes updated successfully.");
        setPatient(data.patient);
      } else {
        throw new Error(data.message || "Failed to update notes.");
      }
    } catch (err) {
      setNotesMessage(`Error: ${err.message}`);
    } finally {
      setUpdatingNotes(false);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
    router.refresh();
  };

  if (!admin || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b15] text-slate-600 dark:text-slate-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p>Loading patient file...</p>
        </div>
      </div>
    );
  }

  if (!patient) return null;

  return (
    <div className="w-full">
      
      <div className="w-full">
        <header className="pb-6 border-b border-slate-200 dark:border-white/[0.05] mb-8">
          <Link
            href="/admin/patients"
            className="text-xs font-semibold uppercase tracking-wider text-sky-400 hover:underline flex items-center gap-1.5 mb-3"
          >
            ← Back to Patient Directory
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{patient.name}</h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    patient.status === "Active"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {patient.status}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Patient ID File: {patient.patientId}</p>
            </div>
          </div>
        </header>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Block: Basic Details */}
          <div className="lg:col-span-7 space-y-6">
            <section className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Personal Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-700 dark:text-slate-300">
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-500 dark:text-slate-500 font-medium block">Date of Birth:</span>
                    <span className="text-slate-900 dark:text-white">
                      {patient.dateOfBirth
                        ? new Date(patient.dateOfBirth).toLocaleDateString()
                        : "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-500 font-medium block">Gender:</span>
                    <span className="text-slate-900 dark:text-white">{patient.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-500 font-medium block">Mobile Number:</span>
                    <span className="text-slate-900 dark:text-white">{patient.phone}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-500 dark:text-slate-500 font-medium block">Email Address:</span>
                    <span className="text-slate-900 dark:text-white">{patient.email || "Not specified"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-500 font-medium block">Home Address:</span>
                    <span className="text-slate-900 dark:text-white">{patient.address || "Not specified"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-500 font-medium block">Registration Date:</span>
                    <span className="text-slate-900 dark:text-white">
                      {new Date(patient.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Note Files section */}
            <section className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Clinical Notes</h2>

              {notesMessage && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm border ${
                    notesMessage.startsWith("Error")
                      ? "bg-red-500/10 border-red-500/20 text-red-400"
                      : "bg-green-500/10 border-green-500/20 text-green-400"
                  }`}
                >
                  {notesMessage}
                </div>
              )}

              <form onSubmit={handleUpdateNotes} className="space-y-4">
                <Textarea
                  placeholder="Allergies, chronic conditions, dental alerts, or special needs..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                />
                <Button
                  type="submit"
                  disabled={updatingNotes}
                  className="bg-sky-500 hover:bg-sky-400 text-slate-900 dark:text-white font-semibold"
                >
                  {updatingNotes ? "Saving notes..." : "Save Notes"}
                </Button>
              </form>
            </section>
          </div>

          {/* Right Block: Appointment History Placeholder */}
          <div className="lg:col-span-5">
            <section className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Appointment History</h2>
              
              <div className="space-y-4">
                {appointments.map((appt) => (
                  <div
                    key={appt._id}
                    className="p-4 rounded-lg bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/[0.03] flex flex-col gap-2 hover:bg-white/[0.02] transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{appt.treatment.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{appt.doctor.name}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          appt.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-sky-500/10 text-sky-400"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500 border-t border-white/[0.02] pt-2 mt-1">
                      <span>{appt.date}</span>
                      <span>{appt.timeSlot}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
