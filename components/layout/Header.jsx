"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Container } from "./Container";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return null;
  }
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/content/settings");
        const data = await res.json();
        if (res.ok && data.success) {
          setSettings(data.data);
        }
      } catch (err) {
        console.error("Failed to load header settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const clinicName = settings?.clinicName || "Aura Dental";

  const treatmentsColumns = [
    {
      title: "Diagnostics & Care",
      items: [
        { name: "Routine Check Up", slug: "routine-check-up" },
        { name: "Dental Fillings", slug: "dental-fillings" },
        { name: "Root Canal Treatment", slug: "root-canal-treatment" },
        { name: "Wisdom Tooth Removal", slug: "wisdom-tooth-removal" }
      ]
    },
    {
      title: "Restorations & Ortho",
      items: [
        { name: "Dental Bridges", slug: "dental-bridges" },
        { name: "Dental Denture", slug: "dental-denture" },
        { name: "Dental Implants", slug: "dental-implants" },
        { name: "Clear Aligners", slug: "clear-aligners" },
        { name: "Dental Braces", slug: "dental-braces" }
      ]
    },
    {
      title: "Cosmetic & Specialized",
      items: [
        { name: "Smile Makeovers", slug: "smile-makeovers" },
        { name: "Pediatric Dentistry", slug: "pediatric-dentistry" },
        { name: "Gum Treatment", slug: "gum-treatment" },
        { name: "Dental Crown", slug: "dental-crown" },
        { name: "Laser-Dentistry", slug: "laser-dentistry" }
      ]
    }
  ];

  const patientCareItems = [
    { name: "FAQs", slug: "faqs" },
    { name: "Patient Testimonials", slug: "testimonials" },
    { name: "Insurance & Payment Options", slug: "insurance-payment" },
    { name: "Dental Insights", slug: "insights" }
  ];

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Treatments", href: "/#treatments", isDropdown: true },
    { label: "Patient Care", href: "/#patient-care", isDropdown: true },
    { label: "Why Trust Us", href: "/#why-trust-us" },
    { label: "Our Doctor", href: "/#meet-doctor" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md transition-all">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-heading font-semibold text-lg text-primary tracking-tight">
            <Stethoscope className="size-6 text-primary" strokeWidth={2.5} />
            <span className="uppercase">{clinicName}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              
              if (link.isDropdown) {
                const isTreatments = link.label === "Treatments";
                return (
                  <div key={link.href} className="relative group py-4">
                    <span
                      className={cn(
                        "text-sm font-medium cursor-pointer transition-colors hover:text-primary flex items-center gap-1",
                        isActive ? "text-primary font-semibold" : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                      <svg className="size-3 text-muted-foreground group-hover:text-primary transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>

                    {/* Dropdown container */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-50 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out">
                      {isTreatments ? (
                        <div className="w-[680px] bg-white/95 backdrop-blur-md border border-slate-100/80 rounded-2xl shadow-premium p-6 grid grid-cols-3 gap-6 text-left">
                          {treatmentsColumns.map((col, cIdx) => (
                            <div key={cIdx} className="flex flex-col gap-2">
                              <h5 className="text-[10px] font-bold text-primary/80 uppercase tracking-widest border-b border-slate-100/60 pb-2">{col.title}</h5>
                              <div className="flex flex-col gap-1">
                                {col.items.map((item, iIdx) => (
                                  <Link
                                    key={iIdx}
                                    href={`/treatments/${item.slug}`}
                                    className="text-xs text-slate-600 hover:text-primary hover:bg-light-green/45 transition-all px-3 py-1.5 rounded-lg font-medium block transform hover:translate-x-1 duration-200"
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="w-60 bg-white/95 backdrop-blur-md border border-slate-100/80 rounded-2xl shadow-premium p-3 flex flex-col gap-1 text-left">
                          {patientCareItems.map((item, idx) => (
                            <Link
                              key={idx}
                              href={`/patient-care/${item.slug}`}
                              className="text-xs text-slate-600 hover:text-primary hover:bg-light-green/45 transition-all px-3 py-2 rounded-lg font-medium block transform hover:translate-x-1 duration-200"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              const isHash = link.href.startsWith("#") || link.href.includes("/#");
              const LinkComponent = isHash ? "a" : Link;

              return (
                <LinkComponent
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </LinkComponent>
              );
            })}
            <a href="#book" className={cn(buttonVariants({ size: "sm" }), "ml-4 bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold rounded-lg")}>
              E - CONSULTATION
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg md:hidden text-muted-foreground hover:bg-alt-background hover:text-foreground transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-background"
          >
            <Container className="py-4 flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                
                if (link.label === "Treatments") {
                  return (
                    <div key={link.href} className="flex flex-col gap-1 border-b border-border/40 py-2 text-left">
                      <span className="text-base font-semibold text-foreground">Treatments</span>
                      <div className="pl-4 flex flex-col gap-1.5 mt-1">
                        <Link href="/#treatments" onClick={() => setIsOpen(false)} className="text-sm text-muted-foreground hover:text-primary">
                          All Treatments
                        </Link>
                      </div>
                    </div>
                  );
                }

                if (link.label === "Patient Care") {
                  return (
                    <div key={link.href} className="flex flex-col gap-1 border-b border-border/40 py-2 text-left">
                      <span className="text-base font-semibold text-foreground">Patient Care</span>
                      <div className="pl-4 flex flex-col gap-1.5 mt-1">
                        {patientCareItems.map((item, idx) => (
                          <Link
                            key={idx}
                            href={`/patient-care/${item.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="text-sm text-muted-foreground hover:text-primary"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                const isHash = link.href.startsWith("#") || link.href.includes("/#");
                const LinkComponent = isHash ? "a" : Link;

                return (
                  <LinkComponent
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-base font-medium py-2 border-b border-border/40 transition-colors text-left",
                      isActive ? "text-primary font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </LinkComponent>
                );
              })}
              <a
                href="#book"
                className={cn(buttonVariants({ size: "lg" }), "w-full mt-2 bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold")}
                onClick={() => setIsOpen(false)}
              >
                E - CONSULTATION
              </a>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
