"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import Textarea from "@/components/ui/textarea";

export default function AdminServicesPage() {
  const [admin, setAdmin] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create"); // "create" or "edit"
  const [selectedService, setSelectedService] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [icon, setIcon] = useState("Stethoscope");
  const [image, setImage] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
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

  // 2. Fetch Services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/services?search=${search}&page=${page}&limit=5`
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setServices(data.services);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [search, page]);

  // Logout Handler
  const handleLogout = () => {
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
    router.refresh();
  };

  // Open Create Modal
  const openCreateModal = () => {
    setModalType("create");
    setSelectedService(null);
    setTitle("");
    setShortDescription("");
    setIcon("Stethoscope");
    setImage("");
    setDisplayOrder(0);
    setStatus("Active");
    setFormError("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (service) => {
    setModalType("edit");
    setSelectedService(service);
    setTitle(service.title);
    setShortDescription(service.shortDescription);
    setIcon(service.icon || "Stethoscope");
    setImage(service.image || "");
    setDisplayOrder(service.displayOrder || 0);
    setStatus(service.status || "Active");
    setFormError("");
    setIsModalOpen(true);
  };

  // Form Submit (Create / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    const token = getCookieToken();
    const url =
      modalType === "create"
        ? "http://localhost:5000/api/services"
        : `http://localhost:5000/api/services/${selectedService._id}`;

    const method = modalType === "create" ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          shortDescription,
          icon,
          image,
          displayOrder: Number(displayOrder),
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save service.");
      }

      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Status Toggle
  const handleToggleStatus = async (id) => {
    const token = getCookieToken();
    try {
      const response = await fetch(`http://localhost:5000/api/services/${id}/toggle`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchServices();
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  // Delete Service
  const handleDeleteService = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    const token = getCookieToken();
    try {
      const response = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchServices();
      }
    } catch (err) {
      console.error("Failed to delete service:", err);
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
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-sky-500/10 text-sky-400 text-sm font-medium transition-all"
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
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.05] mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Services Management</h1>
            <p className="text-slate-400 mt-1">Configure and manage clinical treatment services catalog.</p>
          </div>
          <Button
            onClick={openCreateModal}
            className="bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg px-4 py-2.5 shadow-md shadow-sky-500/10 flex items-center gap-2"
          >
            Add Service
          </Button>
        </header>

        {/* Filters / Search */}
        <div className="mb-6 flex gap-4 max-w-md">
          <Input
            placeholder="Search services by title or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="bg-white/[0.02] border-white/[0.08] text-white"
          />
        </div>

        {/* Services Table */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/[0.05] bg-white/[0.01] text-slate-400 font-semibold">
                  <th className="p-4">Display Order</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Icon</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      Loading services catalog...
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      No services found matching search parameters.
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr key={service._id} className="hover:bg-white/[0.01] transition-all">
                      <td className="p-4 font-semibold text-slate-400">{service.displayOrder}</td>
                      <td className="p-4 font-semibold text-white">{service.title}</td>
                      <td className="p-4 text-slate-400">{service.slug}</td>
                      <td className="p-4 text-slate-400">{service.icon}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            service.status === "Active"
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                          }`}
                        >
                          {service.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Button
                          onClick={() => handleToggleStatus(service._id)}
                          variant="ghost"
                          size="sm"
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Toggle Status
                        </Button>
                        <Button
                          onClick={() => openEditModal(service)}
                          variant="outline"
                          size="sm"
                          className="text-xs border-white/[0.08] hover:bg-white/[0.02]"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteService(service._id)}
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

      {/* CRUD Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === "create" ? "Add Clinical Service" : "Edit Clinical Service"}
        description={
          modalType === "create"
            ? "Enter parameters to create a new clinical service description in the database catalog."
            : "Edit properties of the selected clinical service catalog record."
        }
        className="bg-[#0a0f1d] border-white/[0.08] text-white"
      >
        {formError && (
          <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Service Title"
              placeholder="e.g. Orthodontics Alignment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-white/[0.02] border-white/[0.1] text-white"
            />
          </div>

          <div>
            <Textarea
              label="Short Description"
              placeholder="Provide a concise 1-2 sentence description explaining this care pathway."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              required
              rows={3}
              className="bg-white/[0.02] border-white/[0.1] text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Lucide Icon Component Name"
                placeholder="e.g. Compass, Sparkles, Heart"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                required
                className="bg-white/[0.02] border-white/[0.1] text-white"
              />
            </div>
            <div>
              <Input
                label="Display Order (priority)"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                required
                className="bg-white/[0.02] border-white/[0.1] text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Default Graphic Image URL"
                placeholder="e.g. /images/kids_dental.png"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="bg-white/[0.02] border-white/[0.1] text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Visibility Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-white/[0.1] bg-white/[0.02] px-4 py-3 text-sm transition-all focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/15 outline-none text-white h-[46px]"
              >
                <option value="Active" className="bg-[#0a0f1d] text-white">Active</option>
                <option value="Inactive" className="bg-[#0a0f1d] text-white">Inactive</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.05] flex justify-end gap-3">
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              variant="outline"
              className="border-white/[0.08] hover:bg-white/[0.02]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formLoading}
              className="bg-sky-500 hover:bg-sky-400 text-white font-semibold"
            >
              {formLoading ? "Saving..." : "Save Service"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
