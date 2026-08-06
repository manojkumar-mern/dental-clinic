"use client";

import React, { useEffect, useState, useRef } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function ScrollIndicator() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const [showScrollUp, setShowScrollUp] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Calculate scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (currentScrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);

      // Show/hide floating panel on scroll up
      if (currentScrollY > 200) {
        if (currentScrollY < lastScrollY.current) {
          setShowScrollUp(true);
        } else {
          setShowScrollUp(false);
        }
      } else {
        setShowScrollUp(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAdmin) return null;

  return (
    <div 
      className={cn(
        "fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4 transition-all duration-500",
        showScrollUp ? "opacity-100 translate-x-0" : "opacity-45 translate-x-2 hover:opacity-100 hover:translate-x-0"
      )}
    >
      {/* Scroll Progress Bar Track */}
      <div className="relative w-1.5 h-36 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 w-full bg-primary rounded-full transition-all duration-100"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      {/* Dynamic Scroll Up Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "size-10 rounded-full bg-primary text-white shadow-lg hover:bg-primary-hover flex items-center justify-center transition-all duration-300 cursor-pointer",
          showScrollUp ? "scale-100 translate-y-0 opacity-100" : "scale-0 translate-y-4 opacity-0 pointer-events-none"
        )}
        title="Scroll to Top"
      >
        <ChevronUp className="size-5 animate-pulse" />
      </button>
    </div>
  );
}

export default ScrollIndicator;
