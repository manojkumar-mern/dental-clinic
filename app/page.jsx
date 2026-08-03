"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Award,
  ArrowRight,
  Heart,
  Sparkles,
  CheckCircle2,
  Stethoscope,
  Smile,
  Shield,
  Activity,
  Plus,
  Mail,
  BookOpen,
  HelpCircle,
  AlertTriangle,
  Info,
  Calendar,
  User,
  HeartPulse,
  ChevronRight,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card, CardContent } from "@/components/cards";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);
  
  // Interactive Why Trust tabs
  const [activeTrustTab, setActiveTrustTab] = useState(0);

  // Form submit state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subtle entrance
      gsap.from(".hero-anim", {
        opacity: 0,
        y: 10,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const assistCards = [
    {
      title: "Book Appointment",
      desc: "Select your preferred time slot",
      href: "#book",
      img: "/images/book_appointment.png",
      borderColor: "hover:border-blue-500",
      badgeColor: "bg-blue-600 text-white",
      overlayColor: "from-blue-950/80 via-blue-900/40 to-transparent",
    },
    {
      title: "Dental Implants",
      desc: "Permanent titanium restorations",
      href: "#treatments",
      img: "/images/implant_graphic.png",
      borderColor: "hover:border-emerald-500",
      badgeColor: "bg-emerald-600 text-white",
      overlayColor: "from-emerald-950/80 via-emerald-900/40 to-transparent",
    },
    {
      title: "Tooth Cleaning & Whitening",
      desc: "Brighten your natural smile",
      href: "#treatments",
      img: "/images/teeth_whitening.png",
      borderColor: "hover:border-pink-500",
      badgeColor: "bg-pink-600 text-white",
      overlayColor: "from-pink-950/80 via-pink-900/40 to-transparent",
    },
    {
      title: "Tooth Pain / Sensitivity",
      desc: "Immediate clinical diagnosis",
      href: "#book",
      img: "/images/tooth_pain.png",
      borderColor: "hover:border-amber-500",
      badgeColor: "bg-amber-600 text-white",
      overlayColor: "from-amber-950/80 via-amber-900/40 to-transparent",
    },
    {
      title: "Clear Aligners",
      desc: "Virtually invisible straightening",
      href: "#treatments",
      img: "/images/clear_aligners.png",
      borderColor: "hover:border-purple-500",
      badgeColor: "bg-purple-600 text-white",
      overlayColor: "from-purple-950/80 via-purple-900/40 to-transparent",
    },
    {
      title: "Kid's Dental Care",
      desc: "Comforting pediatric visits",
      href: "#treatments",
      img: "/images/kids_dental.png",
      borderColor: "hover:border-teal-500",
      badgeColor: "bg-teal-600 text-white",
      overlayColor: "from-teal-950/80 via-teal-900/40 to-transparent",
    },
    {
      title: "Emergency Dental Care",
      desc: "Urgent slot accommodations",
      href: "#book",
      img: "/images/emergency_dental.png",
      borderColor: "hover:border-red-500",
      badgeColor: "bg-red-600 text-white",
      overlayColor: "from-red-950/80 via-red-900/40 to-transparent",
    },
    {
      title: "Patient FAQs",
      desc: "Quick treatment guidelines",
      href: "#patient-care",
      img: "/images/patient_faqs.png",
      borderColor: "hover:border-slate-500",
      badgeColor: "bg-slate-700 text-white",
      overlayColor: "from-slate-950/80 via-slate-900/40 to-transparent",
    },
  ];

  const trustTabs = [
    {
      title: "Expert Dental Care",
      desc: "Our board-certified dentists utilize state-of-the-art diagnostic screens to build tooth preservation maps tailored specifically to your clinical parameters.",
      points: ["12+ Years Clinical Practice", "Accredited Academy Surgeons", "Custom Patient Journey Mapping"],
    },
    {
      title: "Emergency Care",
      desc: "We prioritize patient relief. Aura Dental reserves daily emergency blocks to address sudden dental tooth pains or structural damages immediately.",
      points: ["Same-Day Emergency Blocks", "Direct Phone Coordination", "Instant Pain-Management Checks"],
    },
    {
      title: "Hygiene & Safety Standards",
      desc: "Our clinical rooms utilize medical-grade air filtration and multi-cycle autoclave sterilization matching top international clinical guidelines.",
      points: ["HEPA Filtration Exchange", "A-grade Sterilization Logs", "Eco-friendly Biocompatibility"],
    },
    {
      title: "Patient Centric Care",
      desc: "We focus on low-radiation imaging and conservative treatments, recommending only essential dental procedures to protect your enamel structure.",
      points: ["No Aggressive Treatments", "No-obligation Consultations", "Judgment-free Consult Space"],
    },
  ];

  const treatmentsList = [
    { title: "Routine Check Up", desc: "Full mouth diagnostic mappings." },
    { title: "Dental Fillings", desc: "Tooth-colored composite restorations." },
    { title: "Root Canal Treatment", desc: "Painless microscopic nerve therapies." },
    { title: "Wisdom Tooth Removal", desc: "Guided tooth extractions." },
    { title: "Dental Bridges", desc: "Fixed prosthetics securing gap spaces." },
    { title: "Dental Denture", desc: "Lightweight removable dentures." },
    { title: "Dental Implants", desc: "Titanium roots with custom crowns." },
    { title: "Clear Aligners", desc: "Invisalign invisible straightening." },
    { title: "Dental Braces", desc: "Traditional or cosmetic brackets." },
    { title: "Smile Makeovers", desc: "Porcelain aesthetics veneers." },
    { title: "Pediatric Dentistry", desc: "Gentle child care checkups." },
    { title: "Gum Treatment", desc: "Advanced pocket cleaning therapies." },
    { title: "Dental Crown", desc: "CAD-mapped protective tooth caps." },
    { title: "Laser-Dentistry", desc: "Suture-free soft tissue mapping." },
  ];

  const testimonials = [
    { name: "Suresh Kumar", review: "Painless implants. Dr. Vance guided the mapping so I knew exactly what to expect.", rating: 5, date: "Verified Patient" },
    { name: "Priya Sharma", review: "My child felt so relaxed. Best pediatric dental checkup we have ever experienced.", rating: 5, date: "Verified Patient" },
    { name: "Amit Patel", review: "No pushy upselling, very conservative filling treatment. Transparent pricing too.", rating: 5, date: "Verified Patient" },
  ];

  const articles = [
    {
      title: "How Much Cigarette Smoking Causes Mouth Cancer?",
      desc: "Clinical study maps showing toxification metrics of nicotine on cellular mucosa and warning symptoms.",
      tag: "Oral Risks",
    },
    {
      title: "Is It Okay Not to Replace a Missing Tooth?",
      desc: "Delaying implants leads directly to adjacent shifting, jawbone loss, and bite misalignment.",
      tag: "Prosthodontics",
    },
    {
      title: "What Is the Fastest Way to Recover from a Root Canal?",
      desc: "Actionable post-care guidelines to secure your healing cycle and avoid sensitizing gums.",
      tag: "Endodontics",
    },
  ];

  const handleBook = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 1200);
  };

  return (
    <div ref={containerRef} className="w-full bg-background text-[#1E293B] bg-dot-pattern">
      {/* 1. HERO SECTION */}
      <Section id="home" size="md" className="pt-20 pb-10 bg-white bg-grid-pattern border-b border-border/40">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left */}
            <div className="lg:col-span-7 text-left flex flex-col items-start">
              <span className="hero-anim text-[11px] font-bold tracking-widest text-primary bg-light-green/75 px-3 py-1 rounded-full uppercase mb-4">
                ★ Board Certified Dental Care
              </span>
              <h1 className="hero-anim text-4xl sm:text-5xl md:text-6xl font-heading font-semibold text-foreground tracking-tight leading-[1.1] max-w-xl">
                Healthy Smiles <span className="text-primary">Start Early</span>!
              </h1>
              <p className="hero-anim mt-4 text-sm sm:text-base text-muted-foreground font-light max-w-md leading-relaxed">
                Experience specialized, gentle dental care designed for your entire family. We preserve your natural smile using conservative dentistry techniques.
              </p>
              
              <div className="hero-anim mt-6 flex flex-wrap gap-3 items-center text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-primary" /> Cavity Prevention</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-primary" /> Pediatric Checkups</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-primary" /> Invisalign Aligners</span>
              </div>

              <div className="hero-anim mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a href="#book" className={cn(buttonVariants({ size: "lg" }), "bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold rounded-lg shadow-sm")}>
                  Book Consultation
                </a>
                <a href="tel:+15550192834" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-border text-foreground hover:bg-alt-background rounded-lg flex items-center justify-center gap-2")}>
                  <Phone className="size-4 text-primary" />
                  <span>Call (555) 019-2834</span>
                </a>
              </div>
            </div>

            {/* Right */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="hero-anim relative w-full max-w-sm aspect-[4/4] rounded-2xl overflow-hidden border border-border shadow-soft bg-muted group">
                <img
                  src="/images/patient_smile.png"
                  alt="Healthy Patient Smile"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. TRUST BAR */}
      <div className="py-4 border-b border-border/40 bg-alt-background relative z-10 text-xs font-semibold text-muted-foreground">
        <Container>
          <div className="flex flex-wrap justify-center sm:justify-between items-center gap-4 text-center">
            <span>✓ Same-day emergency booking response</span>
            <span>✓ Insurance verified on arrival</span>
            <span>✓ Low-radiation digital imaging mapping</span>
            <span>✓ Valid Clinical Accreditation 2026</span>
          </div>
        </Container>
      </div>

      {/* 3. ASSIST PORTAL: HOW MAY WE ASSIST YOU TODAY? (COLORFUL, LARGE PHOTO CARDS) */}
      <Section size="md" className="bg-white border-b border-border/30 relative z-10">
        <Container>
          <div className="text-center max-w-lg mx-auto mb-8">
            <h2 className="text-2xl font-heading font-semibold text-foreground tracking-tight">How may we assist you today?</h2>
            <p className="text-xs text-muted-foreground font-light mt-1">Select an action block below to open clinical pathways instantly.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {assistCards.map((card, idx) => (
              <a
                key={idx}
                href={card.href}
                className={cn(
                  "relative h-60 rounded-2xl overflow-hidden border border-border/60 flex flex-col justify-end text-left shadow-soft hover:shadow-premium transition-all duration-300 group hover:-translate-y-1",
                  card.borderColor
                )}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Visual Overlay */}
                  <div className={cn("absolute inset-0 bg-gradient-to-t", card.overlayColor)} />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 p-5 text-white flex flex-col items-start gap-1">
                  <h3 className="font-heading font-semibold text-sm leading-snug group-hover:text-primary-hover transition-colors mt-2">{card.title}</h3>
                  <p className="text-[10px] text-white/80 font-light leading-tight">{card.desc}</p>
                  
                  <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-white/90 group-hover:text-white transition-colors">
                    <span>GET STARTED</span>
                    <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. WHY TRUST US: ACCORDION/TABS LAYOUT */}
      <Section id="why-trust-us" size="md" className="bg-alt-background border-b border-border/30 relative z-10 bg-dot-pattern">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left treating patient image */}
            <div className="lg:col-span-5 relative w-full aspect-[4/4] rounded-2xl overflow-hidden border border-border shadow-soft bg-muted group">
              <img
                src="/images/hero_clinic.png"
                alt="Why Trust Aura Dental"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
            </div>

            {/* Right Tabs */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <span className="text-[10px] font-bold tracking-widest text-primary uppercase mb-2">Our Clinical Standards</span>
              <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-foreground tracking-tight mb-6">Why Trust Aura Dental</h2>
              
              <div className="flex flex-wrap gap-1.5 border-b border-border w-full pb-3 mb-6">
                {trustTabs.map((tab, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTrustTab(idx)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                      activeTrustTab === idx ? "bg-white text-primary border border-border shadow-soft" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>

              <div className="text-left">
                <p className="text-xs text-muted-foreground font-light leading-relaxed mb-6">{trustTabs[activeTrustTab].desc}</p>
                <div className="flex flex-col gap-2">
                  {trustTabs[activeTrustTab].points.map((p, pIdx) => (
                    <div key={pIdx} className="flex gap-2 items-center text-xs font-light text-foreground/80">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. INLINE APPOINTMENT FORM CARD */}
      <Section id="book" size="md" className="bg-white border-b border-border/30 relative z-10">
        <Container className="max-w-3xl">
          <Card className="bg-alt-background border border-border/80 p-6 sm:p-8 rounded-2xl shadow-soft">
            <div className="text-center mb-6">
              <h3 className="text-xl font-heading font-semibold text-foreground">Schedule Consultation with Dr. Vance</h3>
              <p className="text-xs text-muted-foreground font-light mt-1">Book your slot. Our care coordinator will call to verify details.</p>
            </div>

            {formSubmitted ? (
              <div className="bg-light-green/40 border border-primary/20 p-6 rounded-xl text-center flex flex-col items-center gap-3">
                <ShieldCheck className="size-10 text-primary" />
                <h4 className="font-semibold text-sm text-foreground">Booking Request Confirmed!</h4>
                <p className="text-xs text-muted-foreground font-light max-w-sm">We have received your details and will call your phone shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleBook} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="bg-white border border-border px-4 py-2.5 rounded-lg text-xs outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="bg-white border border-border px-4 py-2.5 rounded-lg text-xs outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="bg-white border border-border px-4 py-2.5 rounded-lg text-xs outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
                <select
                  required
                  className="bg-white border border-border px-4 py-2.5 rounded-lg text-xs outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                >
                  <option value="">Select Treatment...</option>
                  {treatmentsList.map((t, idx) => (
                    <option key={idx} value={t.title}>{t.title}</option>
                  ))}
                </select>
                <input
                  type="date"
                  required
                  className="bg-white border border-border px-4 py-2.5 rounded-lg text-xs outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 sm:col-span-2"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="sm:col-span-2 py-3 bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold rounded-lg text-xs cursor-pointer shadow-soft transition-colors mt-2"
                >
                  {isSubmitting ? "Sending details..." : "Book Consultation Now"}
                </button>
              </form>
            )}
          </Card>
        </Container>
      </Section>

      {/* 6. AURA DENTAL TREATMENTS GRID (SIMPLE, NEAT, CLEAN WHITE CARDS WITH PRIMARY ACCENTS) */}
      <Section id="treatments" size="md" className="bg-alt-background border-b border-border/30 relative z-10 bg-grid-pattern">
        <Container>
          <div className="text-center max-w-lg mx-auto mb-12">
            <h2 className="text-3xl font-heading font-semibold text-foreground tracking-tight">Clinical Treatments</h2>
            <p className="text-xs text-muted-foreground font-light mt-1">Explore all 14 clinical dental procedures matching top health guidelines.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatmentsList.map((t, idx) => {
              const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              return (
                <Card
                  key={idx}
                  className="p-5 border border-slate-100 bg-white rounded-xl flex flex-col justify-between items-start text-left shadow-soft hover:shadow-medium hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1 h-48"
                >
                  <div className="w-full flex flex-col items-start">
                    <div className="w-6 h-1 rounded-full bg-primary/20 group-hover:bg-primary transition-colors mb-4" />
                    <h4 className="font-heading font-semibold text-sm text-slate-800 leading-snug group-hover:text-primary transition-colors">{t.title}</h4>
                    <p className="text-[11px] text-slate-500 font-light mt-2 leading-relaxed">{t.desc}</p>
                  </div>
                  
                  <Link
                    href={`/treatments/${slug}`}
                    className="text-[10px] text-primary hover:text-primary-hover font-semibold transition-colors mt-auto flex items-center gap-0.5"
                  >
                    <span>Get Details</span>
                    <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 7. PATIENT REVIEWS */}
      <Section size="md" className="bg-white border-b border-border/30 relative z-10">
        <Container>
          <div className="text-center max-w-lg mx-auto mb-10">
            <h2 className="text-2xl font-heading font-semibold text-foreground">Patient Testimonials</h2>
            <p className="text-xs text-muted-foreground font-light mt-1">Real feedback from families in our checkup and restorative programs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <Card key={idx} variant="default" className="p-5 border border-border/60 rounded-xl bg-white hover:border-primary hover:shadow-soft transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex gap-0.5 text-amber-500 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="size-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="italic font-light text-foreground/80 text-xs leading-relaxed mb-4">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t border-border/50 pt-4">
                  <div className="size-7 rounded-full bg-light-green flex items-center justify-center text-primary font-bold text-[10px]">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-foreground">{t.name}</h4>
                    <p className="text-[9px] text-muted-foreground font-light">{t.date}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* 8. PATIENT CARE & INSIGHTS (BLOG) */}
      <Section id="patient-care" size="md" className="bg-alt-background border-b border-border/30 relative z-10 bg-dot-pattern">
        <Container>
          <div className="text-center max-w-lg mx-auto mb-10">
            <h2 className="text-2xl font-heading font-semibold text-foreground">Dental Insights by Aura Dental</h2>
            <p className="text-xs text-muted-foreground font-light mt-1">Read clinical health articles written directly by our doctors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((art, idx) => (
              <Card key={idx} variant="default" className="p-5 border border-border/60 bg-white rounded-xl flex flex-col justify-between hover:border-primary hover:shadow-soft transition-all duration-300 text-left group hover:-translate-y-0.5">
                <div>
                  <span className="text-[9px] font-semibold text-primary uppercase tracking-wider bg-light-green/70 px-2 py-0.5 rounded">{art.tag}</span>
                  <h4 className="font-semibold text-xs text-foreground mt-3 group-hover:text-primary leading-snug transition-colors">{art.title}</h4>
                  <p className="text-[10px] text-muted-foreground font-light mt-2 leading-relaxed">{art.desc}</p>
                </div>
                <a href="#book" className="text-[10px] text-primary hover:underline font-semibold mt-5 flex items-center gap-0.5">
                  <span>Read Guide</span>
                  <ArrowRight className="size-2.5" />
                </a>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* 9. DOCTOR JOURNEY / CTA FOOTER BANNER */}
      <Section id="meet-doctor" size="md" className="bg-primary text-white py-12 relative z-10">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left image of Dr. Eleanor Vance */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-xl overflow-hidden border border-white/20 shadow-soft bg-muted group">
                <img
                  src="/images/dr_eleanor.png"
                  alt="Dr. Eleanor Vance DDS"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Details */}
            <div className="md:col-span-7 flex flex-col items-start text-left">
              <Badge className="bg-white/25 text-white hover:bg-white/20 border-none rounded px-2.5 py-1 text-[10px] tracking-wider uppercase font-semibold mb-3">
                10 Years of Trust
              </Badge>
              <h3 className="text-2xl font-heading font-semibold">Your Journey to a Happier Smile Starts Here</h3>
              <p className="text-xs text-white/80 font-light leading-relaxed mt-3 max-w-md">
                Dr. Eleanor Vance, DDS, is accredited by the Academy of Conservative Dentistry and is committed to minimal-intervention therapies. Meet us for custom smile maps.
              </p>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a href="#book" className={cn(buttonVariants({ size: "sm", variant: "secondary" }), "h-10 px-6 bg-white text-primary hover:bg-light-green font-semibold rounded-lg shadow-sm")}>
                  Book Appointment
                </a>
                <Link href="/about" className="h-10 px-6 border border-white/20 hover:bg-white/10 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
                  <span>Learn More</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
