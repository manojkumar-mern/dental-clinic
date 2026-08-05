"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stethoscope } from "lucide-react";
import { Container } from "./Container";

export function Footer() {
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
        console.error("Failed to load footer settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const clinicName = settings?.clinicName || "Aura Dental";
  const phone = settings?.phone || "+1 (555) 019-2834";
  const email = settings?.email || "care@auradental.com";
  const address = settings?.address || "128 Healthcare Ave, Suite 300";
  const mapsUrl = settings?.googleMapsUrl || "https://maps.google.com";

  const monFri = settings?.workingHours?.monFri || "9:00 AM - 6:00 PM";
  const saturday = settings?.workingHours?.saturday || "9:00 AM - 2:00 PM";
  const sunday = settings?.workingHours?.sunday || "Closed";

  const copyright = settings?.footerCopyright || `© ${new Date().getFullYear()} Aura Dental. All rights reserved.`;

  return (
    <footer className="border-t border-border bg-alt-background text-muted-foreground py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & Contact details */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-heading font-semibold text-lg text-primary tracking-tight">
              <Stethoscope className="size-6 text-primary" strokeWidth={2.5} />
              <span className="uppercase">{clinicName}</span>
            </Link>
            <p className="text-sm font-light leading-relaxed max-w-xs mt-2">
              Experience premium, calm, and precision-focused dental care in a welcoming atmosphere.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
              Quick Links
            </h4>
            <Link href="/" className="text-sm hover:text-primary transition-colors">Home</Link>
            <Link href="/about" className="text-sm hover:text-primary transition-colors">About Us</Link>
            <Link href="/#book" className="text-sm hover:text-primary transition-colors">Contact</Link>
            <Link href="/#book" className="text-sm hover:text-primary transition-colors">Book Appointment</Link>
          </div>

          {/* Opening Hours */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
              Opening Hours
            </h4>
            <div className="flex flex-col gap-1.5 text-sm font-light">
              <p><span className="font-medium text-foreground">Mon - Fri:</span> {monFri}</p>
              <p><span className="font-medium text-foreground">Saturday:</span> {saturday}</p>
              <p><span className="font-medium text-foreground">Sunday:</span> {sunday}</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
              Contact Us
            </h4>
            <div className="flex flex-col gap-1.5 text-sm font-light">
              <p className="text-foreground font-medium">{clinicName}</p>
              <p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {address}
                </a>
              </p>
              <p>
                Phone:{" "}
                <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="hover:text-primary transition-colors">
                  {phone}
                </a>
              </p>
              <p>
                Email:{" "}
                <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                  {email}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light">
          <p>{copyright}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
