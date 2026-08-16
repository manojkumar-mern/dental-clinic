"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Seed the admin account on component mount in development/testing if needed
  useEffect(() => {
    const autoSeed = async () => {
      try {
        await fetch(`${API_BASE_URL}/admin/seed`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        // Silent catch: seed already exists or server is starting up
      }
    };
    autoSeed();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to log in.");
      }

      // Save token in cookie for Next.js middleware and client access
      document.cookie = `adminToken=${data.token}; path=/; max-age=86400; SameSite=Strict`;

      // Redirect to admin dashboard
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d] px-4 py-12 relative overflow-hidden">
      {/* Dynamic Background Highlights */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#0ea5e9]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#3b82f6]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="size-12 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-sky-500/20">
            A
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h2>
          <p className="text-sm text-gray-400 mt-1">Sign in to manage Aura Dental Clinic</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@auradental.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/[0.02] border-white/[0.1] text-white focus:border-sky-500/80 focus:ring-sky-500/15"
            />
          </div>

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/[0.02] border-white/[0.1] text-white focus:border-sky-500/80 focus:ring-sky-500/15 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-sky-500/10 hover:shadow-sky-500/20 transition-all focus:ring-sky-500/20"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
