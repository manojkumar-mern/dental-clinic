"use client";
import { API_BASE_URL } from "@/lib/api";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";

export default function AdminSettingsPage() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Tabs for layout
  const [activeTab, setActiveTab] = useState("general");

  // Form states
  // 1. General
  const [clinicName, setClinicName] = useState("");
  const [logo, setLogo] = useState("");
  const [favicon, setFavicon] = useState("");

  // 2. Contact
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");

  // 3. Working Hours
  const [monFri, setMonFri] = useState("");
  const [saturday, setSaturday] = useState("");
  const [sunday, setSunday] = useState("");

  // 4. Social Media
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [youtube, setYoutube] = useState("");

  // 5. Website / SEO
  const [footerCopyright, setFooterCopyright] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const router = useRouter();

  const getCookieToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];
  };

  // Fetch admin session and clinic settings
  useEffect(() => {
    const initializeData = async () => {
      try {
        const token = getCookieToken();
        if (!token) {
          router.push("/admin/login");
          return;
        }

        // Verify Admin
        const sessionResponse = await fetch(`${API_BASE_URL}/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sessionData = await sessionResponse.json();

        if (sessionResponse.ok && sessionData.success) {
          setAdmin(sessionData.admin);
        } else {
          router.push("/admin/login");
          return;
        }

        // Fetch settings
        const settingsResponse = await fetch(`${API_BASE_URL}/content/settings`);
        const settingsData = await settingsResponse.json();

        if (settingsResponse.ok && settingsData.success && settingsData.data) {
          const s = settingsData.data;
          setClinicName(s.clinicName || "");
          setLogo(s.logo || "");
          setFavicon(s.favicon || "");
          setPhone(s.phone || "");
          setWhatsapp(s.whatsapp || "");
          setEmail(s.email || "");
          setAddress(s.address || "");
          setGoogleMapsUrl(s.googleMapsUrl || "");

          if (s.workingHours) {
            setMonFri(s.workingHours.monFri || "");
            setSaturday(s.workingHours.saturday || "");
            setSunday(s.workingHours.sunday || "");
          }

          if (s.socialMedia) {
            setFacebook(s.socialMedia.facebook || "");
            setInstagram(s.socialMedia.instagram || "");
            setLinkedin(s.socialMedia.linkedin || "");
            setYoutube(s.socialMedia.youtube || "");
          }

          setFooterCopyright(s.footerCopyright || "");
          setSeoTitle(s.seoTitle || "");
          setSeoDescription(s.seoDescription || "");
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [router]);

  // Logout Handler
  const handleLogout = () => {
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
    router.refresh();
  };

  // Submit Settings Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const token = getCookieToken();
    try {
      const response = await fetch(`${API_BASE_URL}/content/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clinicName,
          logo,
          favicon,
          phone,
          whatsapp,
          email,
          address,
          googleMapsUrl,
          workingHours: {
            monFri,
            saturday,
            sunday,
          },
          socialMedia: {
            facebook,
            instagram,
            linkedin,
            youtube,
          },
          footerCopyright,
          seoTitle,
          seoDescription,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update settings.");
      }

      setMessage("Clinic configurations saved successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!admin || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b15] text-slate-600 dark:text-slate-400">
        <p>Loading clinic configuration dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full animate-fadeIn">
      {message && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Tab Headers */}
      <div className="flex border-b border-slate-200 dark:border-white/[0.05] gap-6 mb-8 overflow-x-auto pb-px">
        {["general", "contact", "hours", "social", "seo"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-semibold capitalize tracking-wide border-b-2 transition-all whitespace-nowrap outline-none ${
              activeTab === tab
                ? "border-sky-500 text-sky-400"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-white"
            }`}
          >
            {tab === "hours" ? "Working Hours" : tab === "seo" ? "SEO & Website" : tab}
          </button>
        ))}
      </div>

      {/* Configurations Form */}
      <form onSubmit={handleSubmit} className="w-full bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
          {activeTab === "general" && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">General Clinic Info</h2>
              <div>
                <Input
                  label="Clinic Name"
                  placeholder="e.g. Aura Dental Clinic"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  required
                  className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Logo URL (Optional)"
                    placeholder="e.g. /images/logo.png"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <Input
                    label="Favicon URL (Optional)"
                    placeholder="e.g. /favicon.ico"
                    value={favicon}
                    onChange={(e) => setFavicon(e.target.value)}
                    className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Contact Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Phone Number"
                    placeholder="e.g. +1-555-019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <Input
                    label="WhatsApp Mobile"
                    placeholder="e.g. +1-555-019-2835"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <Input
                  label="Contact Email"
                  type="email"
                  placeholder="e.g. care@auradental.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <Input
                  label="Address Location"
                  placeholder="e.g. 123 Dental Lane, suite 100, New York, NY"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <Input
                  label="Google Maps Embed/View URL (Optional)"
                  placeholder="e.g. https://maps.google.com/..."
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {activeTab === "hours" && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Clinic Working Hours</h2>
              <div>
                <Input
                  label="Monday – Friday Hours"
                  placeholder="e.g. 8:00 AM - 6:00 PM"
                  value={monFri}
                  onChange={(e) => setMonFri(e.target.value)}
                  required
                  className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Saturday Hours"
                    placeholder="e.g. 9:00 AM - 4:00 PM"
                    value={saturday}
                    onChange={(e) => setSaturday(e.target.value)}
                    required
                    className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <Input
                    label="Sunday Hours"
                    placeholder="e.g. Closed"
                    value={sunday}
                    onChange={(e) => setSunday(e.target.value)}
                    required
                    className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Social Channels Linkage</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Facebook URL"
                    placeholder="e.g. https://facebook.com/..."
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <Input
                    label="Instagram URL"
                    placeholder="e.g. https://instagram.com/..."
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    label="LinkedIn URL"
                    placeholder="e.g. https://linkedin.com/..."
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <Input
                    label="YouTube URL"
                    placeholder="e.g. https://youtube.com/..."
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Website & SEO Metadata</h2>
              <div>
                <Input
                  label="Footer Copyright Text"
                  placeholder="e.g. © 2026 Aura Dental. All rights reserved."
                  value={footerCopyright}
                  onChange={(e) => setFooterCopyright(e.target.value)}
                  required
                  className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <Input
                  label="SEO Meta Title"
                  placeholder="Appears in browser tabs..."
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  required
                  className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <Textarea
                  label="SEO Meta Description"
                  placeholder="Summarize site content for search engine indexers..."
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  required
                  rows={3}
                  className="bg-white dark:bg-white/[0.02] border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 dark:border-white/[0.05] flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="bg-sky-500 hover:bg-sky-400 text-slate-900 dark:text-white font-semibold px-6 py-2.5 rounded-lg shadow-md shadow-sky-500/10"
            >
              {saving ? "Saving settings..." : "Save Configuration"}
            </Button>
          </div>
        </form>
      </div>
    );
  }
