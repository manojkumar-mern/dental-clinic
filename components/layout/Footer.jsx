"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ArrowUpRight,
  ArrowUp,
  Globe,
  AtSign,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { Container } from "./Container";

export function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/content/settings`);
        const data = await res.json();
        if (res.ok && data.success) {
          setSettings(data.data);
        }
      } catch (err) {
        console.error("Failed to load footer settings:", err);
      }
    };
    fetchSettings();
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const clinicName = settings?.clinicName || "Aura Dental";
  const phone = settings?.phone || "+1 (555) 019-2834";
  const email = settings?.email || "care@auradental.com";
  const address = settings?.address || "128 Healthcare Ave, Suite 300";
  const mapsUrl = settings?.googleMapsUrl || "https://maps.google.com";

  const monFri = settings?.workingHours?.monFri || "9:00 AM - 6:00 PM";
  const saturday = settings?.workingHours?.saturday || "9:00 AM - 2:00 PM";
  const sunday = settings?.workingHours?.sunday || "Closed";

  const copyright = settings?.footerCopyright || `© ${new Date().getFullYear()} Aura Dental. All rights reserved.`;

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Patient Care", href: "/#patient-care" },
    { label: "Book Appointment", href: "/#book" },
  ];

  const popularTreatments = [
    { label: "Dental Implants", href: "/treatments/dental-implants" },
    { label: "Root Canal Treatment", href: "/treatments/root-canal-treatment" },
    { label: "Clear Aligners", href: "/treatments/clear-aligners" },
    { label: "Smile Makeovers", href: "/treatments/smile-makeovers" },
    { label: "Pediatric Dentistry", href: "/treatments/pediatric-dentistry" },
  ];

  const socials = [
    { label: "Our Website", href: "#", icon: Globe },
    { label: "Follow Us", href: "#", icon: AtSign },
    { label: "Message Us", href: "#", icon: MessageCircle },
  ];

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#0F2D1D] text-slate-300 overflow-hidden">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 size-96 bg-[#84cc16]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-24 size-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10 pt-16 pb-10">
        {/* CTA strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-12 mb-12">
          <div className="flex items-start gap-4">
            <div className="size-11 rounded-xl bg-[#84cc16]/10 border border-[#84cc16]/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5 text-[#84cc16]" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#84cc16] uppercase">
                Your Smile, Our Priority
              </span>
              <h3 className="font-heading text-2xl md:text-3xl font-semibold text-white mt-1.5 leading-snug">
                Ready for a healthier, brighter smile?
              </h3>
            </div>
          </div>
          <Link
            href="/#book"
            className="group inline-flex items-center gap-2 bg-[#84cc16] hover:bg-[#65a30d] text-white px-6 py-3.5 rounded-lg font-semibold text-sm shadow-lg shadow-[#84cc16]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <span>Book Consultation</span>
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Main columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3 font-heading font-semibold text-lg text-white tracking-tight group">
              <span className="flex items-center justify-center size-11 rounded-xl bg-[#84cc16]/15 border border-[#84cc16]/25 transition-all duration-300 group-hover:bg-[#84cc16] group-hover:border-[#84cc16]">
                <Image src="/logo.svg" alt="Aura Dental Logo" width={28} height={28} className="object-contain" />
              </span>
              <span className="uppercase">{clinicName}</span>
            </Link>
            <p className="text-sm font-light leading-relaxed max-w-xs">
              Experience premium, calm, and precision-focused dental care in a welcoming, state-of-the-art environment.
            </p>
            <div className="flex items-center gap-2.5">
              {socials.map((s, idx) => {
                const IconComponent = s.icon;
                return (
                  <a
                    key={idx}
                    href={s.href}
                    aria-label={s.label}
                    className="size-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 transition-all duration-300 hover:bg-[#84cc16] hover:border-[#84cc16] hover:text-white hover:-translate-y-1 hover:scale-110 hover:shadow-lg hover:shadow-[#84cc16]/25"
                  >
                    <IconComponent className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-heading text-sm font-semibold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {quickLinks.map((l, idx) => (
                <Link
                  key={idx}
                  href={l.href}
                  className="group flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors duration-300 w-fit"
                >
                  <ChevronRight className="size-3.5 text-[#84cc16] -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="relative">
                    {l.label}
                    <span className="absolute left-0 -bottom-0.5 h-px w-full bg-[#84cc16] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Treatments */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-heading text-sm font-semibold text-white uppercase tracking-wider">
              Popular Treatments
            </h4>
            <div className="flex flex-col gap-3">
              {popularTreatments.map((t, idx) => (
                <Link
                  key={idx}
                  href={t.href}
                  className="group flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors duration-300 w-fit"
                >
                  <ChevronRight className="size-3.5 text-[#84cc16] -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="relative">
                    {t.label}
                    <span className="absolute left-0 -bottom-0.5 h-px w-full bg-[#84cc16] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Opening Hours */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-heading text-sm font-semibold text-white uppercase tracking-wider">
              Opening Hours
            </h4>
            <div className="flex flex-col gap-3 text-sm font-light">
              <div className="flex items-start gap-2.5">
                <Clock className="size-4 text-[#84cc16] mt-0.5 shrink-0" />
                <p>
                  <span className="text-white font-medium">Mon - Fri:</span>
                  <br />
                  {monFri}
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="size-4 text-[#84cc16] mt-0.5 shrink-0" />
                <p>
                  <span className="text-white font-medium">Saturday:</span>
                  <br />
                  {saturday}
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="size-4 text-[#84cc16] mt-0.5 shrink-0" />
                <p>
                  <span className="text-white font-medium">Sunday:</span>
                  <br />
                  {sunday}
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-heading text-sm font-semibold text-white uppercase tracking-wider">
              Contact Us
            </h4>
            <div className="flex flex-col gap-3 text-sm font-light">
              <p className="text-white font-medium">{clinicName}</p>
              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 text-[#84cc16] mt-0.5 shrink-0" />
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-1 text-slate-300 hover:text-white transition-colors duration-300"
                >
                  <span>{address}</span>
                  <ArrowUpRight className="size-3 text-[#84cc16] opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 shrink-0" />
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="size-4 text-[#84cc16] mt-0.5 shrink-0" />
                <a
                  href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                  className="group inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors duration-300 w-fit"
                >
                  <span>{phone}</span>
                  <ArrowUpRight className="size-3 text-[#84cc16] opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 shrink-0" />
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="size-4 text-[#84cc16] mt-0.5 shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="group inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors duration-300 w-fit break-all"
                >
                  <span>{email}</span>
                  <ArrowUpRight className="size-3 text-[#84cc16] opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light">
          <p>{copyright}</p>
          <div className="flex items-center gap-6">
            <a href="#" className="group relative text-slate-300 hover:text-white transition-colors duration-300">
              Privacy Policy
              <span className="absolute left-0 -bottom-0.5 h-px w-full bg-[#84cc16] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </a>
            <a href="#" className="group relative text-slate-300 hover:text-white transition-colors duration-300">
              Terms of Service
              <span className="absolute left-0 -bottom-0.5 h-px w-full bg-[#84cc16] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </a>
            <button
              onClick={handleScrollTop}
              aria-label="Back to top"
              className="size-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 transition-all duration-300 hover:bg-[#84cc16] hover:border-[#84cc16] hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-[#84cc16]/25 cursor-pointer"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
