"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Stethoscope, 
  Award, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  Heart,
  Briefcase
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";

const doctors = [
  {
    name: "Dr. Eleanor Vance, DDS",
    role: "Lead Dentist & Founder",
    specialty: "Conservative Dentistry & Smile Makeovers",
    experience: "10+ Years Experience",
    education: "Academy of Conservative Dentistry",
    bio: "Dr. Eleanor Vance is committed to minimal-intervention therapies and custom smile mapping. She believes in preserving natural tooth structure while achieving optimal aesthetic and functional results.",
    image: "/images/dr_eleanor.png",
    certifications: ["Accredited AACD Member", "Minimal-Intervention Specialist"],
  },
  {
    name: "Dr. Marcus Sterling, DDS, MS",
    role: "Orthodontist Specialist",
    specialty: "Clear Aligners & Braces",
    experience: "8+ Years Experience",
    education: "Northwestern University Dental School",
    bio: "Dr. Sterling focuses on modern orthodontic solutions, offering clear aligners and custom braces for both children and adults. He integrates digital workflow to plan and preview your perfect alignment.",
    image: "/images/dr_marcus.png",
    certifications: ["Invisalign® Platinum Provider", "Member of AAO"],
  },
  {
    name: "Dr. Sophia Patel, DDS",
    role: "Pediatric & Cosmetic Dentist",
    specialty: "Children's Dentistry & Teeth Whitening",
    experience: "7+ Years Experience",
    education: "Boston University School of Dental Medicine",
    bio: "Dr. Sophia is passionate about making dental visits fun, positive, and anxiety-free for children, while crafting bright, confident smiles for all ages with advanced whitening techniques.",
    image: "/images/dr_sophia.png",
    certifications: ["Pediatric Oral Care Certified", "Teeth Whitening Masterclass Lead"],
  },
  {
    name: "Dr. Adrian Carter, DDS, PhD",
    role: "Oral & Maxillofacial Surgeon",
    specialty: "Dental Implants & Wisdom Tooth Removal",
    experience: "12+ Years Experience",
    education: "Columbia University College of Dental Medicine",
    bio: "Dr. Adrian is a renowned specialist in dental implantology and surgical extractions, focused on patient comfort, absolute precision, and implementing state-of-the-art guided surgery techniques.",
    image: "/images/dr_adrian.png",
    certifications: ["Board Certified Oral Surgeon", "ICOI Fellow"],
  }
];

export default function DoctorsPage() {
  return (
    <div className="bg-slate-50/50 dark:bg-[#070b15] min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0F2D1D] text-white py-20 md:py-24">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#84cc16] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#84cc16] rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#84cc16] mb-3 inline-block">
              Expert Dental Care
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight leading-tight">
              Meet Our Dental Specialists
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
              Our team consists of highly specialized, accredited dentists committed to premium clinical excellence, minimal-intervention therapies, and personalized patient care.
            </p>
          </div>
        </Container>
      </section>

      {/* Doctors Grid Section */}
      <Section className="py-20">
        <Container>
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {doctors.map((doctor, idx) => (
              <StaggerItem key={idx}>
                <div className="bg-white dark:bg-[#0a0f1d] rounded-2xl border border-slate-100 dark:border-white/[0.04] p-6 md:p-8 shadow-premium hover:shadow-premium-hover transition-all duration-300 group flex flex-col md:flex-row gap-6 items-start h-full">
                  {/* Photo Container */}
                  <div className="relative w-full md:w-44 shrink-0 aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05]">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 20vw"
                    />
                    <div className="absolute top-3 left-3 bg-[#84cc16] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded shadow-sm">
                      {doctor.role.split(" & ").pop()}
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="flex-1 flex flex-col justify-between h-full text-left">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-heading font-semibold text-slate-900 dark:text-white group-hover:text-[#84cc16] transition-colors duration-200">
                            {doctor.name}
                          </h3>
                          <p className="text-[#84cc16] text-xs font-semibold uppercase tracking-wider mt-1">
                            {doctor.role}
                          </p>
                        </div>
                      </div>

                      {/* Info Pills */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-white/[0.02] px-2.5 py-1 rounded-md border border-slate-100 dark:border-white/[0.04]">
                          <Briefcase className="size-3 text-[#84cc16]" />
                          {doctor.experience}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-white/[0.02] px-2.5 py-1 rounded-md border border-slate-100 dark:border-white/[0.04]">
                          <GraduationCap className="size-3 text-[#84cc16]" />
                          {doctor.education.split(" ").slice(-3).join(" ")}
                        </span>
                      </div>

                      <p className="mt-4 text-xs font-light text-slate-500 dark:text-slate-400 leading-relaxed">
                        {doctor.bio}
                      </p>

                      {/* Certifications List */}
                      <div className="mt-4 space-y-1.5 border-t border-slate-100 dark:border-white/[0.04] pt-4">
                        {doctor.certifications.map((cert, cIdx) => (
                          <div key={cIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="size-3.5 text-[#84cc16] shrink-0" />
                            <span>{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.04]">
                      <a
                        href="/#book"
                        className={cn(
                          buttonVariants({ size: "sm" }),
                          "w-full bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold rounded-lg flex items-center justify-center gap-2 py-2"
                        )}
                      >
                        <Calendar className="size-4" />
                        <span>Schedule With {doctor.name.split(",")[0].replace("Dr. ", "")}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </Section>
    </div>
  );
}
