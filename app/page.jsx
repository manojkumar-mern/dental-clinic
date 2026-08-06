"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FadeUp, SlideInLeft, SlideInRight, StaggerContainer, StaggerItem } from "@/components/ui/motion";
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
  Compass,
  Anchor,
  Baby,
  Droplets,
  Siren,
  Sun,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card, CardContent } from "@/components/cards";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  
  // Services horizontal scroll refs
  const servicesSectionRef = useRef(null);
  const servicesScrollRef = useRef(null);

  // Interactive Why Trust tabs
  const [activeTrustTab, setActiveTrustTab] = useState(0);

  // Form submit state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Booking form states
  const [bookName, setBookName] = useState("");
  const [bookPhone, setBookPhone] = useState("");
  const [bookEmail, setBookEmail] = useState("");
  const [bookServiceId, setBookServiceId] = useState("");
  const [bookDate, setBookDate] = useState("");
  const [bookTime, setBookTime] = useState("");
  const [bookReason, setBookReason] = useState("");
  const [bookingError, setBookingError] = useState("");

  // Separate list of services fetched from DB for the booking dropdown (needs real MongoDB _id)
  const [bookingServices, setBookingServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  const [settings, setSettings] = useState(null);

  // Form toggling tab
  const [formTab, setFormTab] = useState("appointment"); // "appointment" or "contact"

  // Contact form states
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/content/settings");
        const data = await res.json();
        if (res.ok && data.success) {
          setSettings(data.data);
          if (data.data.seoTitle) {
            document.title = data.data.seoTitle;
          }
        }
      } catch (err) {
        console.error("Failed to load page settings:", err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    // Setting up anything else if needed
  }, []);

  // Handle smooth scroll for anchor links and initial hash load
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href) return;
      
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;
      
      const path = href.substring(0, hashIndex);
      const hash = href.substring(hashIndex + 1);
      
      // If it's a same-page anchor link
      if (path === "" || path === "/" || path === window.location.pathname) {
        const target = document.getElementById(hash);
        if (target) {
          e.preventDefault();
          const headerHeight = 64; // h-16
          const extraSpacing = 16;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = targetPosition - headerHeight - extraSpacing;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
          
          window.history.pushState(null, "", `#${hash}`);
        }
      }
    };

    const handleInitialHash = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const target = document.getElementById(hash);
        if (target) {
          setTimeout(() => {
            const headerHeight = 64;
            const extraSpacing = 16;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = targetPosition - headerHeight - extraSpacing;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }, 500); // Small timeout to ensure GSAP and layout are ready
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    
    if (document.readyState === "complete") {
      handleInitialHash();
    } else {
      window.addEventListener("load", handleInitialHash);
    }

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("load", handleInitialHash);
    };
  }, []);

  const [servicesList, setServicesList] = useState([
    {
      title: "Preventative Care",
      desc: "Comprehensive cleanings, digital diagnostics, and custom cavity prevention maps.",
      img: "/images/teeth_whitening.png",
      icon: ShieldCheck,
      href: "/treatments/routine-check-up",
    },
    {
      title: "Dental Implants",
      desc: "Permanent titanium restorations matching natural bone structures with CAD-mapped precision.",
      img: "/images/implant_graphic.png",
      icon: Heart,
      href: "/treatments/dental-implants",
    },
    {
      title: "Clear Aligners",
      desc: "Virtually invisible, comfortable teeth alignment maps utilizing certified Invisalign pathways.",
      img: "/images/clear_aligners.png",
      icon: Compass,
      href: "/treatments/clear-aligners",
    },
    {
      title: "Cosmetic Makeovers",
      desc: "Enhance your confidence with porcelain veneers and premium composite bonding treatments.",
      img: "/images/patient_smile.png",
      icon: Sparkles,
      href: "/treatments/smile-makeovers",
    },
    {
      title: "Root Canal Treatment",
      desc: "Painless microscopic nerve-saving therapies that relieve toothache and preserve natural roots.",
      img: "/images/tooth_pain.png",
      icon: Activity,
      href: "/treatments/root-canal-treatment",
    },
    {
      title: "Pediatric Dentistry",
      desc: "Gentle, comfort-first dental checkups and protective sealant therapies designed for kids.",
      img: "/images/kids_dental.png",
      icon: Smile,
      href: "/treatments/pediatric-dentistry",
    },
    {
      title: "Emergency Relief",
      desc: "Immediate same-day booking response for unexpected pain, dental damage, or toothaches.",
      img: "/images/emergency_dental.png",
      icon: AlertTriangle,
      href: "#book",
    },
    {
      title: "Laser-Dentistry",
      desc: "Suture-free, drill-free soft tissue therapies for gum reshaping and quick, gentle healing.",
      img: "/images/tooth_hologram.png",
      icon: Shield,
      href: "/treatments/laser-dentistry",
    },
  ]);

  useEffect(() => {
    const fetchActiveServices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/services?status=Active");
        const data = await response.json();
        if (response.ok && data.success && data.services && data.services.length > 0) {
          const mapped = data.services.map((service) => ({
            id: service._id,
            title: service.title,
            desc: service.shortDescription,
            img: service.image || "/images/teeth_whitening.png",
            icon: service.icon || "Stethoscope",
            href: `/treatments/${service.slug}`,
          }));
          setServicesList(mapped);
          // Populate the booking dropdown separately with only DB services (real ObjectIds)
          setBookingServices(mapped);
        }
      } catch (err) {
        console.error("Failed to load dynamic active services:", err);
      } finally {
        setServicesLoading(false);
      }
    };
    fetchActiveServices();
  }, []);

  // Services shown in the "Our Services" section: drop Preventative Care and cap at 8
  const displayedServices = servicesList
    .filter((s) => s && s.title && !/preventative|preventive/i.test(s.title))
    .slice(0, 8);

  // Horizontal scroll for "Our Services": vertical page scroll drives right-to-left movement
  useEffect(() => {
    const html = document.documentElement;
    const prevScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isDesktop || prefersReducedMotion) {
      return () => {
        html.style.scrollBehavior = prevScrollBehavior;
      };
    }

    const section = servicesSectionRef.current;
    const scrollContainer = servicesScrollRef.current;

    if (!section || !scrollContainer) {
      return () => {
        html.style.scrollBehavior = prevScrollBehavior;
      };
    }

    let ctx;
    ctx = gsap.context(() => {
      const getAmount = () => scrollContainer.scrollWidth - window.innerWidth;

      if (getAmount() > 0) {
        gsap.to(scrollContainer, {
          x: () => -getAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${getAmount()}`,
            invalidateOnRefresh: true,
          },
        });
      }
    }, section);

    return () => {
      html.style.scrollBehavior = prevScrollBehavior;
      if (ctx) ctx.revert();
    };
  }, [displayedServices.length]);

  const helpCategories = [
    {
      title: "Teeth Cleaning",
      subtitle: "Scaling, polishing & check-ups",
      href: "/treatments/routine-check-up",
      icon: Droplets,
    },
    {
      title: "Smile Makeover",
      subtitle: "Veneers & cosmetic bonding",
      href: "/treatments/smile-makeovers",
      icon: Sparkles,
    },
    {
      title: "Teeth Whitening",
      subtitle: "Brighten your natural smile",
      href: "/treatments/smile-makeovers",
      icon: Sun,
    },
    {
      title: "Dental Implants",
      subtitle: "Permanent tooth replacement",
      href: "/treatments/dental-implants",
      icon: Anchor,
    },
    {
      title: "Braces & Aligners",
      subtitle: "Clear & fixed orthodontics",
      href: "/treatments/clear-aligners",
      icon: Compass,
    },
    {
      title: "Kids Dentistry",
      subtitle: "Gentle care for little smiles",
      href: "/treatments/pediatric-dentistry",
      icon: Baby,
    },
    {
      title: "Root Canal Treatment",
      subtitle: "Painless nerve-saving therapy",
      href: "/treatments/root-canal-treatment",
      icon: Activity,
    },
    {
      title: "Emergency Dental Care",
      subtitle: "Same-day urgent relief",
      href: "#book",
      icon: Siren,
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
      desc: `We prioritize patient relief. ${settings?.clinicName || "Aura Dental"} reserves daily emergency blocks to address sudden dental tooth pains or structural damages immediately.`,
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

  const handleBook = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setBookingError("");

    try {
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: bookName,
          phone: bookPhone,
          email: bookEmail || undefined,
          service: bookServiceId,
          preferredDate: bookDate,
          preferredTime: bookTime,
          reasonForVisit: bookReason || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit appointment request.");
      }

      setFormSubmitted(true);
    } catch (err) {
      setBookingError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactError("");

    try {
      const response = await fetch("http://localhost:5000/api/contact-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contactName,
          phone: contactPhone || undefined,
          email: contactEmail,
          subject: contactSubject || undefined,
          message: contactMessage,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send message.");
      }

      setContactSubmitted(true);
    } catch (err) {
      setContactError(err.message || "Something went wrong.");
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-background text-[#1E293B] bg-dot-pattern">
      {/* 1. HERO SECTION */}
      <Section id="home" size="md" className="pt-12 pb-10 bg-white bg-grid-pattern border-b border-border/40">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left */}
            <StaggerContainer className="lg:col-span-7 text-left flex flex-col items-start">
              <StaggerItem className="text-[11px] font-bold tracking-widest text-primary bg-light-green/75 px-3 py-1 rounded-full uppercase mb-4">
                ★ Board Certified Dental Care
              </StaggerItem>
              <StaggerItem>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-semibold text-foreground tracking-tight leading-[1.08] max-w-xl">
                  Elevate Your <span className="text-primary relative inline-block">Smile<span className="absolute bottom-1 left-0 w-full h-1 bg-[#84cc16] rounded-full opacity-60"></span></span>,<br />Empower Your <span className="text-secondary">Health</span>
                </h1>
              </StaggerItem>
              <StaggerItem>
                <p className="mt-4 text-sm sm:text-base text-muted-foreground font-light max-w-md leading-relaxed">
                  Experience premium, customized dental care designed around clinical precision. We safeguard your natural teeth using advanced non-invasive mapping protocols.
                </p>
              </StaggerItem>
              
              <StaggerItem className="mt-6 flex flex-wrap gap-3 items-center text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-primary" /> Cavity Prevention</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-primary" /> Pediatric Checkups</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-primary" /> Invisalign Aligners</span>
              </StaggerItem>

              <StaggerItem className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a href="#book" className={cn(buttonVariants({ size: "lg" }), "bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold rounded-lg shadow-sm")}>
                  Book Consultation
                </a>
                <a href={`tel:${settings?.phone ? settings.phone.replace(/[^+\d]/g, "") : "+15550192834"}`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-border text-foreground hover:bg-alt-background rounded-lg flex items-center justify-center gap-2")}>
                  <Phone className="size-4 text-primary" />
                  <span>Call {settings?.phone || "(555) 019-2834"}</span>
                </a>
              </StaggerItem>
            </StaggerContainer>

            {/* Right */}
            <SlideInRight className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-[4/4] rounded-2xl overflow-hidden border border-border shadow-soft bg-muted group">
                <Image
                  src="/images/patient_smile.png"
                  alt="Healthy Patient Smile"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </SlideInRight>
          </div>
        </Container>
      </Section>

      {/* 2. TRUST BAR */}
      <div className="py-4 border-b border-border/40 bg-alt-background relative z-10 text-xs font-semibold text-muted-foreground overflow-hidden">
        <div className="w-full">
          <div className="animate-marquee flex gap-12 py-1 items-center">
            <div className="flex shrink-0 gap-12 min-w-full justify-around">
              <span>✓ Same-day emergency booking response</span>
              <span>✓ Insurance verified on arrival</span>
              <span>✓ Low-radiation digital imaging mapping</span>
              <span>✓ Valid Clinical Accreditation 2026</span>
            </div>
            <div className="flex shrink-0 gap-12 min-w-full justify-around" aria-hidden="true">
              <span>✓ Same-day emergency booking response</span>
              <span>✓ Insurance verified on arrival</span>
              <span>✓ Low-radiation digital imaging mapping</span>
              <span>✓ Valid Clinical Accreditation 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. HOW CAN WE HELP YOU? CATEGORY NAVIGATION */}
      <Section id="how-can-we-help" size="md" className="bg-white border-b border-border/30 relative z-10">
        <Container>
          <FadeUp className="text-center max-w-lg mx-auto mb-8">
            <span className="text-xs font-bold tracking-widest text-primary uppercase bg-light-green/50 px-3 py-1 rounded-full">
              Treatment Categories
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-foreground tracking-tight mt-3">
              How Can We <span className="text-primary">Help You?</span>
            </h2>
            <p className="text-sm text-muted-foreground font-light mt-2">Choose a category to find the right treatment for your smile.</p>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {helpCategories.map((cat, idx) => {
              const IconComponent = cat.icon;
              return (
                <StaggerItem key={idx} className="h-full">
                  <Link
                    href={cat.href}
                    className="group flex flex-col items-start gap-2.5 p-5 h-full rounded-2xl border border-border/60 bg-white shadow-soft hover:shadow-premium hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="size-11 rounded-xl bg-light-green flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                      <IconComponent className="size-5" />
                    </div>
                    <h3 className="font-heading font-semibold text-sm text-slate-800 group-hover:text-primary transition-colors mt-1">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-light leading-snug">{cat.subtitle}</p>
                    <span className="mt-auto inline-flex items-center gap-1 text-[11px] font-semibold text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      View Treatment
                      <ArrowRight className="size-3" />
                    </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </Container>
      </Section>

      {/* 4. WHY TRUST US: ACCORDION/TABS LAYOUT */}
      <Section id="why-trust-us" size="md" className="bg-alt-background border-b border-border/30 relative z-10 bg-dot-pattern">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left treating patient image */}
            <SlideInLeft className="lg:col-span-5 relative w-full aspect-[4/4] rounded-2xl overflow-hidden border border-border shadow-soft bg-muted group">
              <Image
                src="/images/hero_clinic.png"
                alt={`Why Trust ${settings?.clinicName || "Aura Dental"}`}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </SlideInLeft>

            {/* Right Tabs */}
            <FadeUp className="lg:col-span-7 flex flex-col items-start">
              <span className="text-xs font-bold tracking-widest text-primary uppercase bg-light-green/50 px-3 py-1 rounded-full mb-3">Our Clinical Standards</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-foreground tracking-tight mt-3 mb-6">Why Trust <span className="text-primary">{settings?.clinicName || "Aura Dental"}</span></h2>
              
              <div className="flex flex-wrap gap-1.5 border-b border-border w-full pb-3 mb-6">
                {trustTabs.map((tab, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTrustTab(idx)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                      activeTrustTab === idx ? "bg-white text-primary border border-border shadow-soft" : "text-muted-foreground hover:text-foreground hover:-translate-y-[1px]"
                    )}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>

              <div className="text-left">
                <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">{trustTabs[activeTrustTab].desc}</p>
                <div className="flex flex-col gap-2">
                  {trustTabs[activeTrustTab].points.map((p, pIdx) => (
                    <div key={pIdx} className="flex gap-2 items-center text-sm font-light text-foreground/80">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </Container>
      </Section>

      {/* 4.5 OUR SERVICES: HORIZONTAL SCROLL SECTION */}
      <section ref={servicesSectionRef} className="relative bg-white lg:py-24 py-16 border-b border-border/30">
        <div className="w-full flex flex-col relative">
          <FadeUp className="mb-6 lg:mb-10 px-4 md:px-8 lg:px-[10vw] shrink-0 text-left">
            <span className="text-xs font-bold tracking-widest text-primary bg-light-green/50 px-3 py-1 rounded-full uppercase">
              Featured Specialties
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-foreground tracking-tight mt-3">
              Featured <span className="text-primary">Services</span>
            </h2>
            <p className="text-sm text-muted-foreground font-light mt-2 max-w-md">
              Explore our most popular treatments. Scroll to explore.
            </p>
          </FadeUp>

          {/* Scrolling horizontal container */}
          <div className="w-full lg:overflow-hidden overflow-x-auto pb-10 scrollbar-hide snap-x snap-mandatory">
            <div ref={servicesScrollRef} className="w-max">
              <StaggerContainer className="flex flex-row gap-6 px-4 md:px-8 lg:px-[10vw] w-max">
              {displayedServices.map((service, idx) => {
                const IconComponent = typeof service.icon === "string"
                  ? (LucideIcons[service.icon] || LucideIcons.Stethoscope)
                  : service.icon;
                return (
                  <StaggerItem 
                    key={idx}
                    className="shrink-0 snap-center w-[300px] lg:w-[400px] bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between group hover:shadow-md transition-all duration-300 relative hover:-translate-y-[2px]"
                  >
                    <div>
                      {/* Image Frame with zoom on hover */}
                      <div className="relative w-full h-40 lg:h-48 rounded-xl overflow-hidden mb-4 bg-slate-50 border border-slate-100/50">
                        <Image 
                          src={service.img} 
                          alt={service.title} 
                          fill
                          sizes="(max-width: 1024px) 300px, 400px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        {/* Floating Service Icon */}
                        <div className="absolute top-3 right-3 size-9 rounded-full bg-white/95 backdrop-blur-xs shadow-soft flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          <IconComponent className="size-4.5" />
                        </div>
                      </div>

                      <h3 className="font-heading font-semibold text-base lg:text-lg text-slate-900 mb-1.5 leading-snug group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs lg:text-sm text-slate-500 font-light leading-relaxed">
                        {service.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100/80 flex justify-between items-center">
                      <Link 
                        href={service.href} 
                        className="px-4 py-2 border border-slate-200 hover:border-primary hover:bg-light-green hover:text-primary text-xs font-semibold text-slate-700 rounded-lg transition-all duration-300 hover:scale-[1.02]"
                      >
                        Learn More
                      </Link>
                      <span className="text-xs font-bold text-slate-300 group-hover:text-primary/40 transition-colors">
                        0{idx + 1}
                      </span>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
            </div>
          </div>

          {/* View all services */}
          <div className="flex justify-center mt-10 lg:mt-12 px-4 md:px-8 lg:px-[10vw]">
            <Link
              href="/services"
              className={cn(buttonVariants({ size: "lg" }), "bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold rounded-lg shadow-sm px-8 group")}
            >
              <span>View All Services</span>
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. INLINE APPOINTMENT FORM CARD */}
      <Section id="book" size="md" className="bg-white border-b border-border/30 relative z-10">
        <Container className="max-w-3xl">
          <FadeUp>
            <Card className="bg-alt-background border border-border/80 p-6 sm:p-8 rounded-2xl shadow-soft">
              <div className="text-center mb-6">
                <h3 className="text-xl font-heading font-semibold text-foreground">Schedule Consultation with Dr. Vance</h3>
                <p className="text-sm text-muted-foreground font-light mt-1">Book your slot. Our care coordinator will call to verify details.</p>
              </div>

            <div className="flex justify-center border-b border-slate-100 mb-6">
              <button
                type="button"
                onClick={() => setFormTab("appointment")}
                className={`pb-2.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all outline-none ${
                  formTab === "appointment"
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Book Consultation
              </button>
              <button
                type="button"
                onClick={() => setFormTab("contact")}
                className={`pb-2.5 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all outline-none ${
                  formTab === "contact"
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Send Us a Message
              </button>
            </div>

            {formTab === "appointment" ? (
              formSubmitted ? (
                <div className="bg-light-green/40 border border-primary/20 p-6 rounded-xl text-center flex flex-col items-center gap-3">
                  <ShieldCheck className="size-10 text-primary" />
                  <h4 className="font-semibold text-sm text-foreground">Booking Request Confirmed!</h4>
                  <p className="text-sm text-muted-foreground font-light max-w-sm">
                    We have received your appointment request, and it is currently awaiting confirmation from our care coordinator.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBook} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bookingError && (
                    <div className="sm:col-span-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-left">
                      {bookingError}
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                    className="bg-white border border-border px-4 py-2.5 rounded-lg text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    value={bookPhone}
                    onChange={(e) => setBookPhone(e.target.value)}
                    className="bg-white border border-border px-4 py-2.5 rounded-lg text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={bookEmail}
                    onChange={(e) => setBookEmail(e.target.value)}
                    className="bg-white border border-border px-4 py-2.5 rounded-lg text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                  <select
                    required
                    disabled={servicesLoading}
                    value={bookServiceId}
                    onChange={(e) => setBookServiceId(e.target.value)}
                    className="bg-white border border-border px-4 py-2.5 rounded-lg text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-slate-700 disabled:opacity-60 disabled:cursor-wait"
                  >
                    {servicesLoading ? (
                      <option value="">Loading services...</option>
                    ) : bookingServices.length === 0 ? (
                      <option value="">No services available</option>
                    ) : (
                      <>
                        <option value="">Select Treatment...</option>
                        {bookingServices.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.title}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  <input
                    type="date"
                    required
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="bg-white border border-border px-4 py-2.5 rounded-lg text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                  <select
                    required
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    className="bg-white border border-border px-4 py-2.5 rounded-lg text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 text-slate-700"
                  >
                    <option value="">Select Time Slot...</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Reason for Visit (Optional)"
                    value={bookReason}
                    onChange={(e) => setBookReason(e.target.value)}
                    className="bg-white border border-border px-4 py-2.5 rounded-lg text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 sm:col-span-2"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="sm:col-span-2 py-3 bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold rounded-lg text-sm cursor-pointer shadow-soft transition-colors mt-2"
                  >
                    {isSubmitting ? "Sending details..." : "Book Consultation Now"}
                  </button>
                </form>
              )
            ) : (
              contactSubmitted ? (
                <div className="bg-light-green/40 border border-primary/20 p-6 rounded-xl text-center flex flex-col items-center gap-3">
                  <ShieldCheck className="size-10 text-primary" />
                  <h4 className="font-semibold text-sm text-foreground">Message Sent Successfully!</h4>
                  <p className="text-sm text-muted-foreground font-light max-w-sm">
                    Thank you for reaching out. We have received your query and will reply to your email address shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contactError && (
                    <div className="sm:col-span-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-left">
                      {contactError}
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="bg-white border border-border px-4 py-2.5 rounded-lg text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number (Optional)"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="bg-white border border-border px-4 py-2.5 rounded-lg text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="bg-white border border-border px-4 py-2.5 rounded-lg text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 sm:col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="Subject (Optional)"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="bg-white border border-border px-4 py-2.5 rounded-lg text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 sm:col-span-2"
                  />
                  <textarea
                    placeholder="Your Message..."
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={4}
                    className="bg-white border border-border px-4 py-2.5 rounded-lg text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 sm:col-span-2 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="sm:col-span-2 py-3 bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold rounded-lg text-sm cursor-pointer shadow-soft transition-colors mt-2"
                  >
                    {contactSubmitting ? "Sending message..." : "Send Message Now"}
                  </button>
                </form>
              )
            )}
          </Card>
          </FadeUp>
        </Container>
      </Section>


      {/* 9. DOCTOR JOURNEY / CTA FOOTER BANNER */}
      <Section id="meet-doctor" size="md" className="bg-primary text-white py-12 relative z-10">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left image of Dr. Eleanor Vance */}
            <SlideInLeft className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-xl overflow-hidden border border-white/20 shadow-soft bg-muted group">
                <Image
                  src="/images/dr_eleanor.png"
                  alt="Dr. Eleanor Vance DDS"
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover"
                />
              </div>
            </SlideInLeft>

            {/* Right Details */}
            <SlideInRight className="md:col-span-7 flex flex-col items-start text-left">
              <Badge className="bg-white/25 text-white hover:bg-white/20 border-none rounded px-2.5 py-1 text-xs tracking-wider uppercase font-semibold mb-3">
                10 Years of Trust
              </Badge>
              <h3 className="text-2xl font-heading font-semibold">Your Journey to a Happier Smile Starts Here</h3>
              <p className="text-sm text-white/80 font-light leading-relaxed mt-3 max-w-md">
                Dr. Eleanor Vance, DDS, is accredited by the Academy of Conservative Dentistry and is committed to minimal-intervention therapies. Meet us for custom smile maps.
              </p>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a href="#book" className={cn(buttonVariants({ size: "sm", variant: "secondary" }), "h-10 px-6 bg-white text-primary hover:bg-light-green font-semibold rounded-lg shadow-sm")}>
                  Book Appointment
                </a>
                <Link href="/about" className="h-10 px-6 border border-white/20 hover:bg-white/10 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors">
                  <span>Learn More</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </SlideInRight>
          </div>
        </Container>
      </Section>
    </div>
  );
}
