"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Phone, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/cards";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AboutPage() {
  const coreValues = [
    { title: "Patient First Care", desc: "We customize clinical mappings to match your exact parameters, recommending only essential dental care." },
    { title: "Calm & Sterile Space", desc: "Our clinic utilizes medical-grade air filtration and multi-cycle autoclave sterilization matching international guidelines." },
    { title: "Advanced Technology", desc: "Low-radiation digital imaging, flexible orthodontic alignment planning, and high-precision tissue lasers." }
  ];

  return (
    <div className="w-full bg-background text-[#1E293B] bg-dot-pattern">
      {/* Back to Home Link */}
      <div className="bg-white border-b border-border/30 py-3">
        <Container>
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="size-3.5" />
            <span>Back to Home</span>
          </Link>
        </Container>
      </div>

      {/* Hero Section */}
      <Section size="md" className="bg-white border-b border-border/30 bg-grid-pattern">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 text-left flex flex-col items-start">
              <span className="text-[10px] font-bold tracking-widest text-primary bg-light-green/75 px-3 py-1 rounded-full uppercase mb-4">
                ★ Meet Our Dentist
              </span>
              <h1 className="text-3xl sm:text-4xl font-heading font-semibold text-foreground tracking-tight leading-[1.1] max-w-lg">
                Dr. Eleanor Vance, DDS
              </h1>
              <p className="mt-4 text-sm text-muted-foreground font-light max-w-md leading-relaxed">
                Accredited by the Academy of Conservative Dentistry, Dr. Vance is dedicated to preserving your natural smile. With over 10 years of clinical trust, she designs customized treatment journeys that prioritize minimal intervention.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> Minimal Intervention</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> Family-Focused Care</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> Certified Invisalign Provider</span>
              </div>
              <div className="mt-8 flex gap-3">
                <Link href="/#book" className={cn(buttonVariants({ size: "md" }), "bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold rounded-lg")}>
                  Book Consultation
                </Link>
                <a href="tel:+15550192834" className={cn(buttonVariants({ variant: "outline", size: "md" }), "border-border text-foreground rounded-lg")}>
                  Call Clinic
                </a>
              </div>
            </div>
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-xl overflow-hidden border border-border shadow-soft bg-muted group">
                <img
                  src="/images/dr_eleanor.png"
                  alt="Dr. Eleanor Vance DDS"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Core Values Section */}
      <Section size="md" className="bg-alt-background border-b border-border/30">
        <Container>
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-heading font-semibold text-foreground tracking-tight">Our Clinic Principles</h2>
            <p className="text-xs text-muted-foreground mt-1">Every treatment follows our standard minimal-intervention rules.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreValues.map((val, idx) => (
              <Card key={idx} className="p-6 border border-slate-100 bg-white rounded-xl shadow-soft flex flex-col items-start hover:border-primary/20 transition-all duration-300">
                <div className="size-6 rounded-full bg-light-green flex items-center justify-center text-primary font-bold text-xs mb-4">
                  0{idx + 1}
                </div>
                <h4 className="font-heading font-semibold text-sm text-slate-800 leading-snug mb-2">{val.title}</h4>
                <p className="text-xs text-slate-500 font-light leading-relaxed">{val.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
