"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import Textarea from "@/components/ui/textarea";

export default function AdminPatientsPage() {
  const [admin, setAdmin] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create"); // "create" or "edit"
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("Male");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Active");

  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

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

  // 2. Fetch Patients
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/patients?search=${search}&page=${page}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${getCookieToken()}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setPatients(data.patients);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Failed to load patients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchPatients();
    }
  }, [search, page, admin]);

  // Logout Handler
  const handleLogout = () => {
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
    router.refresh();
  };

  // Open Create Modal
  const openCreateModal = () => {
    setModalType("create");
    setSelectedPatient(null);
    setName("");
    setPhone("");
    setEmail("");
    setDateOfBirth("");
    setGender("Male");
    setAddress("");
    setNotes("");
    setStatus("Active");
    setFormError("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (patient) => {
    setModalType("edit");
    setSelectedPatient(patient);
    setName(patient.name);
    setPhone(patient.phone);
    setEmail(patient.email || "");
    setDateOfBirth(patient.dateOfBirth ? patient.dateOfBirth.substring(0, 10) : "");
    setGender(patient.gender || "Male");
    setAddress(patient.address || "");
    setNotes(patient.notes || "");
    setStatus(patient.status || "Active");
    setFormError("");
    setIsModalOpen(true);
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    const token = getCookieToken();
    const url =
      modalType === "create"
        ? "http://localhost:5000/api/patients"
        : `http://localhost:5000/api/patients/${selectedPatient._id}`;

    const method = modalType === "create" ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          phone,
          email: email || undefined,
          dateOfBirth: dateOfBirth || undefined,
          gender,
          address,
          notes,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save patient.");
      }

      setIsModalOpen(false);
      fetchPatients();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Patient
  const handleDeletePatient = async (id) => {
    if (!confirm("Are you sure you want to delete this patient record?")) return;

    const token = getCookieToken();
    try {
      const response = await fetch(`http://localhost:5000/api/patients/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchPatients();
      }
    } catch (err) {
      console.error("Failed to delete patient:", err);
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
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-white/[0.05] mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Patients Management</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Register and manage dental clinic patients.</p>
          </div>
          <Button
            onClick={openCreateModal}
            className="bg-sky-500 hover:bg-sky-400 text-slate-900 dark:text-white font-semibold rounded-lg px-4 py-2.5 shadow-md shadow-sky-500/10 flex items-center gap-2"
          >
            Add Patient
          </Button>
        </header>

        {/* Filters / Search */}
        <div className="mb-6 flex gap-4 max-w-md">
          <Input
            placeholder="Search by ID, Name, or Mobile..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.08] text-slate-900 dark:text-white"
          />
        </div>

        {/* Patients Table */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.01] text-slate-600 dark:text-slate-400 font-semibold">
                  <th className="p-4">Patient ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Gender</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-slate-700 dark:text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500 dark:text-slate-500">
                      Loading patient directory...
                    </td>
                  </tr>
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500 dark:text-slate-500">
                      No patients registered in directory.
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-white/[0.01] transition-all">
                      <td className="p-4 font-semibold text-sky-400">
                        <Link href={`/admin/patients/${patient._id}`} className="hover:underline">
                          {patient.patientId}
                        </Link>
                      </td>
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">
                        <Link href={`/admin/patients/${patient._id}`} className="hover:underline">
                          {patient.name}
                        </Link>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{patient.phone}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{patient.gender}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            patient.status === "Active"
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : "bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {patient.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Link href={`/admin/patients/${patient._id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-slate-600 dark:text-slate-400 hover:text-white"
                          >
                            View
                          </Button>
                        </Link>
                        <Button
                          onClick={() => openEditModal(patient)}
                          variant="outline"
                          size="sm"
                          className="text-xs border-slate-300 dark:border-white/[0.08] hover:bg-white/[0.02]"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeletePatient(patient._id)}
                          variant="destructive"
                          size="sm"
                          className="text-xs"
                        >
                          Delete
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

      {/* CRUD Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === "create" ? "Add Patient Record" : "Edit Patient Record"}
        description="Provide patient details below to create or update clinical records."
        className="bg-[#0a0f1d] border-slate-300 dark:border-white/[0.08] text-slate-900 dark:text-white"
      >
        {formError && (
          <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Full Name"
              placeholder="e.g. Johnathan Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Mobile Number"
                placeholder="e.g. +15550192834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <Input
                label="Email Address (Optional)"
                type="email"
                placeholder="e.g. john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                label="Date of Birth (Optional)"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1.5">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-white/[0.1] bg-white dark:bg-white/[0.02] px-4 py-3 text-sm transition-all focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/15 outline-none text-slate-900 dark:text-white h-[46px]"
              >
                <option value="Male" className="bg-[#0a0f1d] text-slate-900 dark:text-white">Male</option>
                <option value="Female" className="bg-[#0a0f1d] text-slate-900 dark:text-white">Female</option>
                <option value="Other" className="bg-[#0a0f1d] text-slate-900 dark:text-white">Other</option>
              </select>
            </div>
          </div>

          <div>
            <Input
              label="Home Address"
              placeholder="e.g. 123 Main St, New York, NY"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <Textarea
              label="Clinic Notes (Allergies, Medical Alerts, etc.)"
              placeholder="Add patient special alerts or note files..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-white/[0.1] bg-white dark:bg-white/[0.02] px-4 py-3 text-sm transition-all focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/15 outline-none text-slate-900 dark:text-white h-[46px]"
            >
              <option value="Active" className="bg-[#0a0f1d] text-slate-900 dark:text-white">Active</option>
              <option value="Inactive" className="bg-[#0a0f1d] text-slate-900 dark:text-white">Inactive</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/[0.05] flex justify-end gap-3">
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              variant="outline"
              className="border-slate-300 dark:border-white/[0.08] hover:bg-white/[0.02]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formLoading}
              className="bg-sky-500 hover:bg-sky-400 text-slate-900 dark:text-white font-semibold"
            >
              {formLoading ? "Saving..." : "Save Patient"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
