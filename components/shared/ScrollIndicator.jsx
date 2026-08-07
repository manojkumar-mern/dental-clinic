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
  const [activeSection, setActiveSection] = useState("hero");
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

      // Active Section Detection
      if (pathname === "/about") {
        const heroEl = document.getElementById("about-hero");
        const journeyEl = document.getElementById("about-journey");
        const detailsEl = document.getElementById("about-details");

        if (heroEl && journeyEl && detailsEl) {
          const scrollPosition = currentScrollY + 300;
          if (scrollPosition >= detailsEl.offsetTop) {
            setActiveSection("details");
          } else if (scrollPosition >= journeyEl.offsetTop) {
            setActiveSection("journey");
          } else {
            setActiveSection("hero");
          }
        }
      } else {
        // Generic active section detection based on scroll percentage
        if (progress > 66) {
          setActiveSection("bottom");
        } else if (progress > 33) {
          setActiveSection("middle");
        } else {
          setActiveSection("top");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  if (isAdmin) return null;

  // Configure dot items depending on path
  const dots = pathname === "/about" 
    ? [
        { id: "about-hero", label: "About Us", key: "hero" },
        { id: "about-journey", label: "Our Journey", key: "journey" },
        { id: "about-details", label: "Clinic Details", key: "details" },
      ]
    : [
        { percentage: 0, label: "Top", key: "top" },
        { percentage: 50, label: "Middle", key: "middle" },
        { percentage: 100, label: "Bottom", key: "bottom" },
      ];

  const handleDotClick = (dot) => {
    if (dot.id) {
      const el = document.getElementById(dot.id);
      if (el) {
        window.scrollTo({
          top: el.offsetTop - 80,
          behavior: "smooth"
        });
      }
    } else if (typeof dot.percentage === "number") {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: (totalHeight * dot.percentage) / 100,
        behavior: "smooth"
      });
    }
  };

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

      {/* Section Bullet Indicators */}
      <div className="flex flex-col gap-3 py-2 px-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-border/50 rounded-full shadow-lg">
        {dots.map((dot) => (
          <button 
            key={dot.key}
            onClick={() => handleDotClick(dot)}
            title={dot.label}
            className={cn(
              "size-2.5 rounded-full transition-all cursor-pointer",
              activeSection === dot.key ? "bg-primary scale-125" : "bg-slate-300 dark:bg-slate-600 hover:bg-primary/50"
            )}
          />
        ))}
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
