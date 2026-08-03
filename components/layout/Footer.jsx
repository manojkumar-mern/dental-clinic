import React from "react";
import Link from "next/link";
import { Stethoscope } from "lucide-react";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-border bg-alt-background text-muted-foreground py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & Contact details */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-heading font-semibold text-lg text-primary tracking-tight">
              <Stethoscope className="size-6 text-primary" strokeWidth={2.5} />
              <span>AURA DENTAL</span>
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
              <p><span className="font-medium text-foreground">Mon - Fri:</span> 9:00 AM - 6:00 PM</p>
              <p><span className="font-medium text-foreground">Saturday:</span> 9:00 AM - 2:00 PM</p>
              <p><span className="font-medium text-foreground">Sunday:</span> Closed</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
              Contact Us
            </h4>
            <div className="flex flex-col gap-1.5 text-sm font-light">
              <p className="text-foreground font-medium">Aura Dental Clinic</p>
              <p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  128 Healthcare Ave, Suite 300
                </a>
              </p>
              <p>
                Phone:{" "}
                <a href="tel:+15550192834" className="hover:text-primary transition-colors">
                  +1 (555) 019-2834
                </a>
              </p>
              <p>
                Email:{" "}
                <a href="mailto:care@auradental.com" className="hover:text-primary transition-colors">
                  care@auradental.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light">
          <p>© {new Date().getFullYear()} Aura Dental. All rights reserved.</p>
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
