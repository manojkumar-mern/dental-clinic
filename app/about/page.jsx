"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FadeUp, SlideInLeft, SlideInRight, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { 
  ArrowLeft, 
  ArrowUp, 
  CheckCircle2, 
  ChevronUp, 
  Compass, 
  GraduationCap, 
  Heart, 
  MapPin, 
  Phone, 
  Sparkles, 
  Stethoscope, 
  Award, 
  ShieldCheck 
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AboutPage() {
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const lastScrollY = useRef(0);

  const heroRef = useRef(null);
  const journeyRef = useRef(null);
  const detailsRef = useRef(null);

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

      // Detect active section
      const heroEl = heroRef.current;
      const journeyEl = journeyRef.current;
      const detailsEl = detailsRef.current;

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
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const timelineEvents = [
    {
      year: "01",
      title: "The Vision",
      desc: "A clinic built around patient comfort, trust, and modern dental care.",
      icon: Compass,
      color: "from-emerald-500 to-teal-600",
    },
    {
      year: "02",
      title: "Personalized Care",
      desc: "Every treatment plan is tailored to the patient's needs and concerns.",
      icon: Heart,
      color: "from-blue-500 to-indigo-600",
    },
    {
      year: "03",
      title: "Modern Approach",
      desc: "Using contemporary dental techniques with a focus on comfort and precision.",
      icon: Sparkles,
      color: "from-purple-500 to-pink-600",
    },
    {
      year: "04",
      title: "Building Trust",
      desc: "Creating lasting relationships through honest communication and quality care.",
      icon: ShieldCheck,
      color: "from-amber-500 to-orange-600",
    },
  ];

  const highlights = [
    {
      title: "Gentle & Painless Care",
      desc: "Advanced local anaesthetics and conservative protocols mapping minimal discomfort.",
    },
    {
      title: "Autoclave Sterilization",
      desc: "Strict multi-cycle sterilization checks matching international hospital standards.",
    },
    {
      title: "Advanced Diagnostics",
      desc: "Using low-radiation digital imaging and CAD/CAM tooth mapping.",
    },
    {
      title: "Preserving Natural Enamel",
      desc: "No aggressive interventions or unnecessary treatments. We preserve first.",
    },
  ];

  const scrollToSection = (elementRef) => {
    if (elementRef.current) {
      window.scrollTo({
        top: elementRef.current.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full bg-background text-[#1E293B] bg-dot-pattern min-h-screen relative selection:bg-light-green selection:text-primary">
      
      {/* Back to Home Link */}
      <div className="bg-white border-b border-border/30 py-3 relative z-20">
        <Container>
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="size-3.5" />
            <span>Back to Home</span>
          </Link>
        </Container>
      </div>

      {/* --- FLOATING SIDE SCROLL & SCROLL-UP PANEL --- */}
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
          <button 
            onClick={() => scrollToSection(heroRef)}
            title="About Us"
            className={cn(
              "size-2.5 rounded-full transition-all cursor-pointer",
              activeSection === "hero" ? "bg-primary scale-125" : "bg-slate-300 dark:bg-slate-600 hover:bg-primary/50"
            )}
          />
          <button 
            onClick={() => scrollToSection(journeyRef)}
            title="Our Journey"
            className={cn(
              "size-2.5 rounded-full transition-all cursor-pointer",
              activeSection === "journey" ? "bg-primary scale-125" : "bg-slate-300 dark:bg-slate-600 hover:bg-primary/50"
            )}
          />
          <button 
            onClick={() => scrollToSection(detailsRef)}
            title="Clinic Details"
            className={cn(
              "size-2.5 rounded-full transition-all cursor-pointer",
              activeSection === "details" ? "bg-primary scale-125" : "bg-slate-300 dark:bg-slate-600 hover:bg-primary/50"
            )}
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

      {/* --- HERO HEADER SECTION --- */}
      <section 
        ref={heroRef}
        className="w-full pt-20 pb-20 bg-gradient-to-br from-light-green/30 via-white to-background border-b border-border/30 bg-grid-pattern relative overflow-hidden"
      >
        <div className="absolute top-1/3 left-1/10 size-96 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <StaggerContainer className="lg:col-span-7 text-left flex flex-col items-start">
              <StaggerItem className="text-xs font-bold tracking-widest text-primary bg-light-green/80 px-3.5 py-1.5 rounded-full uppercase mb-5 shadow-xs">
                ★ Redefining Dental Excellence
              </StaggerItem>
              <StaggerItem>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-semibold text-foreground tracking-tight leading-[1.08] mb-6">
                  Trusted <span className="text-primary relative inline-block">Care<span className="absolute bottom-1 left-0 w-full h-1 bg-[#84cc16] rounded-full opacity-60"></span></span><br />
                  Beautiful <span className="text-secondary">Smiles</span>
                </h1>
              </StaggerItem>
              <StaggerItem>
                <p className="text-sm sm:text-base text-muted-foreground font-light max-w-lg leading-relaxed mb-8">
                  We combine advanced clinical technology with a warm, personalized touch. Our approach focuses on gentle, conservative treatments to safeguard your natural smile for a lifetime.
                </p>
              </StaggerItem>
              
              <StaggerItem className="flex flex-wrap gap-4 text-xs font-medium text-slate-600 mb-8">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border/40 rounded-full shadow-xs">
                  <CheckCircle2 className="size-4 text-primary shrink-0" /> Minimal Intervention
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border/40 rounded-full shadow-xs">
                  <CheckCircle2 className="size-4 text-primary shrink-0" /> Certified Invisalign Provider
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border/40 rounded-full shadow-xs">
                  <CheckCircle2 className="size-4 text-primary shrink-0" /> Safe Autoclave Sterility
                </span>
              </StaggerItem>

              <StaggerItem className="flex gap-3">
                <Link href="/#book" className={cn(buttonVariants({ size: "lg" }), "bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold rounded-xl shadow-md shadow-light-green/20 transition-all duration-300 hover:-translate-y-0.5")}>
                  Book Consultation
                </Link>
                <a href="tel:+15550192834" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-border text-foreground hover:bg-alt-background rounded-xl transition-all duration-300 hover:-translate-y-0.5")}>
                  Call Clinic
                </a>
              </StaggerItem>
            </StaggerContainer>

            {/* Right Hologram Visual */}
            <SlideInRight className="lg:col-span-5 flex justify-center relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full filter blur-3xl pointer-events-none scale-75 animate-pulse" />
              <div className="relative w-full max-w-[400px] aspect-square rounded-2xl overflow-hidden border border-white/80 bg-white/45 backdrop-blur-md shadow-premium p-4 group transition-all duration-500 hover:shadow-2xl hover:border-primary/20">
                <Image
                  src="/images/tooth_hologram.png"
                  alt="3D Hologram of Tooth Restorations"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </SlideInRight>

          </div>
        </Container>
      </section>

      {/* --- THE TIMELINE: OUR JOURNEY --- */}
      <section 
        ref={journeyRef}
        className="w-full py-24 bg-white relative overflow-hidden"
      >
        <Container>
          <FadeUp className="text-center max-w-xl mx-auto mb-20">
            <span className="text-xs font-bold tracking-widest text-primary uppercase bg-light-green/50 px-3 py-1 rounded-full">
              Historical Timeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-foreground tracking-tight mt-3">
              The Journey of <span className="text-primary">Aura Dental</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-2 font-light">
              How we built a decade of clinical excellence and patient trust.
            </p>
          </FadeUp>

          {/* Timeline Wrapper */}
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Center Line */}
            <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-0.5 bg-slate-100 transform -translate-x-1/2" />
            
            {/* Scroll Progress Fill on Line */}
            <div 
              className="absolute left-8 sm:left-1/2 top-0 w-0.5 bg-primary transform -translate-x-1/2 transition-all duration-500" 
              style={{ height: `${Math.min(100, Math.max(0, (scrollProgress - 15) * 2))}%` }}
            />

            {/* Timeline Nodes */}
            <StaggerContainer className="space-y-16">
              {timelineEvents.map((event, idx) => {
                const IconComponent = event.icon;
                const isEven = idx % 2 === 0;

                return (
                  <StaggerItem 
                    key={idx} 
                    className="flex flex-col sm:flex-row relative w-full items-start"
                  >
                    {/* Node Dot */}
                    <div className="absolute left-8 sm:left-1/2 top-6 size-10 rounded-full bg-white border-2 border-primary shadow-md flex items-center justify-center transform -translate-x-1/2 z-10 transition-transform duration-300 hover:scale-110">
                      <IconComponent className="size-4 text-primary" />
                    </div>

                    {/* Timeline Card Container */}
                    <div className={cn(
                      "w-full pl-20 sm:pl-0 sm:w-[calc(50%-40px)] lg:w-[calc(50%-48px)] relative",
                      isEven ? "sm:mr-auto" : "sm:ml-auto"
                    )}>
                      {/* Connector Line */}
                      {isEven ? (
                        <>
                          {/* Tablet Connector */}
                          <div className="absolute top-[34px] right-[-40px] w-[40px] h-0.5 bg-slate-200/80 hidden sm:block lg:hidden" />
                          {/* Desktop Connector */}
                          <div className="absolute top-[34px] right-[-48px] w-[48px] h-0.5 bg-slate-200/80 hidden lg:block" />
                        </>
                      ) : (
                        <>
                          {/* Tablet Connector */}
                          <div className="absolute top-[34px] left-[-40px] w-[40px] h-0.5 bg-slate-200/80 hidden sm:block lg:hidden" />
                          {/* Desktop Connector */}
                          <div className="absolute top-[34px] left-[-48px] w-[48px] h-0.5 bg-slate-200/80 hidden lg:block" />
                        </>
                      )}
                      
                      {/* Mobile Connector Line */}
                      <div className="absolute top-[34px] left-[32px] w-[48px] h-0.5 bg-slate-200/80 sm:hidden" />

                      {/* Card Content */}
                      <div className="p-6 rounded-2xl border border-border bg-white shadow-soft hover:shadow-md hover:border-primary/20 transition-all duration-300 group hover:-translate-y-1 text-left">
                        <span className={cn(
                          "inline-block px-3 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r mb-3",
                          event.color
                        )}>
                          {event.year}
                        </span>
                        <h4 className="font-heading font-semibold text-base text-slate-800 mb-2 leading-snug group-hover:text-primary transition-colors">
                          {event.title}
                        </h4>
                        <p className="text-sm text-slate-500 font-light leading-relaxed">
                          {event.desc}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </Container>
      </section>

      {/* --- CLINIC DETAILS SECTION (Dark Green background style) --- */}
      <section 
        ref={detailsRef}
        className="w-full py-24 bg-[#0F2D1D] text-white relative overflow-hidden"
      >
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl pointer-events-none" />
        <Container>
          
          <FadeUp className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-7 text-left">
              <span className="text-xs font-semibold tracking-wider text-secondary uppercase bg-white/10 px-3 py-1 rounded-md">
                About the Practice
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-white tracking-tight mt-4 mb-6">
                Aura Dental Clinic — Kelambakkam&apos;s Trusted Dental Center
              </h2>
              <p className="text-sm text-slate-300 font-light leading-relaxed max-w-2xl mb-4">
                At Aura Dental, we are committed to providing premium care with state-of-the-art clinical mapping systems. Our doctors prioritize tooth conservation, utilizing low-radiation tools and minimally invasive therapies designed to match your parameters perfectly.
              </p>
              <p className="text-sm text-slate-300 font-light leading-relaxed max-w-2xl">
                Whether visiting us for a routine preventative screening or an advanced alignment planning setup, you will experience patient-first hospitality at every step.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-left">
                <h4 className="text-2xl font-bold text-secondary font-heading">10+</h4>
                <p className="text-xs text-slate-300 mt-1 uppercase font-semibold tracking-wider">Years of Trust</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-left">
                <h4 className="text-2xl font-bold text-secondary font-heading">10k+</h4>
                <p className="text-xs text-slate-300 mt-1 uppercase font-semibold tracking-wider">Happy Patients</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-left">
                <h4 className="text-2xl font-bold text-secondary font-heading">99.8%</h4>
                <p className="text-xs text-slate-300 mt-1 uppercase font-semibold tracking-wider">Safety Rating</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-left">
                <h4 className="text-2xl font-bold text-secondary font-heading">14+</h4>
                <p className="text-xs text-slate-300 mt-1 uppercase font-semibold tracking-wider">Treatments</p>
              </div>
            </div>
          </FadeUp>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-10 border-t border-white/10">
            {highlights.map((item, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-start items-start text-left"
              >
                <div className="size-6 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xs mb-4">
                  0{idx + 1}
                </div>
                <h5 className="font-heading font-semibold text-base text-white mb-2">{item.title}</h5>
                <p className="text-xs md:text-sm text-slate-300 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </Container>
      </section>

    </div>
  );
}
