"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import {
  Users, Calendar, Activity, Settings, Layers, MessageSquare, Sun, Moon, Menu, X, LogOut,
  PanelLeftClose, PanelLeftOpen, Globe
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function AdminWrapper({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(true); // Defaults to pinned/open
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Check saved theme
    const savedTheme = localStorage.getItem("adminTheme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    // Check saved sidebar state
    const savedSidebarPinned = localStorage.getItem("adminSidebarPinned");
    if (savedSidebarPinned !== null) {
      setIsSidebarPinned(savedSidebarPinned === "true");
    }
  }, []);

  useEffect(() => {
    // Only apply wrapper logic if not on login page
    if (pathname === "/admin/login") return;

    const getCookieToken = () => {
      return document.cookie
        .split("; ")
        .find((row) => row.startsWith("adminToken="))
        ?.split("=")[1];
    };

    const token = getCookieToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setAdmin(data.admin);
        } else {
          document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          router.push("/admin/login");
        }
      } catch (err) {
        console.error("Session error:", err);
        document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push("/admin/login");
      }
    };
    fetchSession();
  }, [pathname, router]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("adminTheme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("adminTheme", "light");
    }
  };

  const toggleSidebarPin = () => {
    const nextState = !isSidebarPinned;
    setIsSidebarPinned(nextState);
    localStorage.setItem("adminSidebarPinned", String(nextState));
  };

  const handleLogout = () => {
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
    router.refresh();
  };

  // If login page or not mounted yet, render without layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!mounted || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070b15] text-slate-500 dark:text-slate-400 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-sm font-medium tracking-wide">Securing administrator workspace...</p>
        </div>
      </div>
    );
  }

  const navLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Activity },
    { name: "Appointments", href: "/admin/appointments", icon: Calendar },
    { name: "Patients", href: "/admin/patients", icon: Users },
    { name: "Services", href: "/admin/services", icon: Layers },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  // Dynamic CSS classes for sidebar width and text visibility
  const sidebarWidthClass = isSidebarPinned 
    ? "md:w-64" 
    : "md:w-[88px] md:hover:w-64";

  const textVisibilityClass = isSidebarPinned 
    ? "opacity-100 w-auto" 
    : "opacity-0 w-0 md:group-hover:w-auto md:group-hover:opacity-100 transition-all duration-300 overflow-hidden";

  const gapClass = isSidebarPinned 
    ? "gap-4" 
    : "gap-4 md:gap-0 md:group-hover:gap-4";

  const footerGapClass = isSidebarPinned 
    ? "gap-3" 
    : "gap-3 md:gap-0 md:group-hover:gap-3";

  const logoutGapClass = isSidebarPinned 
    ? "gap-2" 
    : "gap-2 md:gap-0 md:group-hover:gap-2";

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-[#070b15] dark:text-slate-100 antialiased font-sans`}>
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#0a0f1d] border-b border-slate-200 dark:border-white/[0.05] z-30">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow shadow-sky-500/20">
            A
          </div>
          <span className="font-bold tracking-widest uppercase text-sm">AURA DENTAL</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
          {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Desktop Layout: Fixed-width spacer to prevent content shifting when sidebar expands on hover */}
      <div 
        className={`hidden md:block transition-all duration-300 ease-in-out shrink-0 ${isSidebarPinned ? 'w-64' : 'w-[88px]'}`} 
      />

      {/* Side Navigation Bar (Fixed position allows overlay expansion on hover) */}
      <aside 
        className={`
          group fixed z-40 top-0 left-0 h-screen bg-white dark:bg-[#0a0f1d] border-r border-slate-200 dark:border-white/[0.05] flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0
          ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
          ${sidebarWidthClass}
        `}
      >
        {/* Brand Header */}
        <div className="p-6 md:px-4 md:group-hover:px-6 shrink-0 transition-all duration-300">
          <div className="flex items-center gap-4 h-10 overflow-hidden whitespace-nowrap">
            <div className="size-10 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white font-extrabold text-lg shadow shadow-sky-500/20 shrink-0">
              A
            </div>
            <span className={`font-bold tracking-widest uppercase text-sm text-slate-800 dark:text-white transition-all duration-300 ${textVisibilityClass}`}>
              AURA DENTAL
            </span>
          </div>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto scrollbar-none px-6 md:px-4 md:group-hover:px-6 py-2 transition-all duration-300">
          <nav className="space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    flex items-center ${gapClass} px-3 md:px-2.5 md:group-hover:px-3 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap overflow-hidden
                    ${isActive 
                      ? 'bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-500/15' 
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.02] border border-transparent'
                    }
                  `}
                  title={!isSidebarPinned ? link.name : ""}
                >
                  {/* Sidebar icons are bolded (stroke-[2.5]) for clear visibility */}
                  <Icon className="size-5 shrink-0 stroke-[2.5]" />
                  <span className={`transition-all duration-300 ${textVisibilityClass}`}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Fixed Sidebar Footer (contains Admin profile info, Pinned Toggle, and Logout) */}
        <div className="p-6 md:px-4 md:group-hover:px-6 border-t border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#0a0f1d] shrink-0 space-y-4 transition-all duration-300">
          
          {/* Pin/Unpin Toggle Button (Visible on Desktop) */}
          <button
            onClick={toggleSidebarPin}
            className={`hidden md:flex items-center ${footerGapClass} w-full px-3 md:px-2.5 md:group-hover:px-3 py-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all text-xs font-semibold overflow-hidden`}
            title={isSidebarPinned ? "Minimize Sidebar" : "Pin Sidebar"}
          >
            {isSidebarPinned ? (
              <>
                <PanelLeftClose className="size-4 shrink-0" />
                <span className={`transition-all duration-300 ${textVisibilityClass}`}>Collapse Navigation</span>
              </>
            ) : (
              <>
                <PanelLeftOpen className="size-4 shrink-0" />
                <span className={`transition-all duration-300 ${textVisibilityClass}`}>Pin Navigation</span>
              </>
            )}
          </button>

          {/* Admin profile */}
          <div className={`flex items-center ${footerGapClass} overflow-hidden`}>
            <div className="size-10 rounded-xl bg-slate-200 dark:bg-gradient-to-tr dark:from-slate-800 dark:to-slate-700 flex items-center justify-center font-bold text-sky-600 dark:text-sky-400 border border-slate-300 dark:border-white/[0.08] shadow-inner uppercase shrink-0">
              {admin.name.charAt(0)}
            </div>
            <div className={`transition-all duration-300 ${textVisibilityClass}`}>
              <p className="text-sm font-semibold leading-tight text-slate-950 dark:text-white truncate max-w-[130px]">{admin.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-0.5 uppercase">{admin.role}</p>
            </div>
          </div>

          {/* Fixed Logout Button at the bottom of the sidebar */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className={`w-full flex items-center justify-center ${logoutGapClass} py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-white hover:bg-red-500 hover:border-red-500 border-slate-300 dark:border-white/[0.1] transition-all`}
          >
            <LogOut className="size-4 shrink-0" />
            <span className={`transition-all duration-300 ${textVisibilityClass}`}>Log Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-[#070b15]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/[0.05] flex items-center justify-between px-8 shrink-0 z-10 sticky top-0">
          <div>
             <h2 className="text-lg font-bold text-slate-800 dark:text-white capitalize">
               {pathname.split('/').pop() || 'Dashboard'}
             </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-all shadow-xs"
            >
              <Globe className="size-4" />
              <span className="hidden sm:inline">Back to Website</span>
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-white/[0.03] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#0a0f1d] transition-all border border-slate-200 dark:border-transparent"
              title="Toggle Day/Night Mode"
            >
              {isDarkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 dark:bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
