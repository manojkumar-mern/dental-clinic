"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  ArrowLeft, 
  Phone, 
  MessageSquare, 
  Star,
  HelpCircle,
  ShieldCheck,
  CreditCard,
  Percent
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/cards";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export default function PatientCareDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;
  const containerRef = React.useRef(null);

  const [activeFaq, setActiveFaq] = useState(null);
  const [settings, setSettings] = useState(null);

  // 1. FAQs Data
  const faqs = [
    {
      q: "Do you accept dental insurance?",
      a: "Yes! Aura Dental is empaneled with major health and dental insurance providers. Our front desk team will verify your benefits upon arrival to ensure hassle-free claim processing and direct cashless settlements where applicable."
    },
    {
      q: "How do I schedule a same-day emergency appointment?",
      a: "We reserve dedicated emergency slots every day specifically for acute tooth pain, fractures, or accidental dental trauma. Please call our clinic helpline directly at (555) 019-2834 for immediate coordination."
    },
    {
      q: "What options do you offer for payment plans?",
      a: "We accept all major credit/debit cards, online UPI payments, and offer zero-cost EMI plans with our finance partners. This allows you to split payments into 3, 6, or 9 comfortable monthly installments."
    },
    {
      q: "How often should I get a routine dental checkup?",
      a: "We recommend visiting us once every 6 months for a routine diagnostic checkup and scaling. This allows us to identify cavities early, track gum health, and clean hard-to-reach calculus."
    },
    {
      q: "Are clear aligners as effective as metal braces?",
      a: "For the vast majority of orthodontic alignment cases, clear aligners are highly effective, virtually invisible, and more comfortable. However, severe bite skeletal corrections may still benefit from traditional braces, which our specialists will verify during your scan."
    }
  ];

  // 2. Testimonials Data
  const testimonials = [
    { name: "Suresh Kumar", review: "Painless implants. Dr. Vance guided the mapping so I knew exactly what to expect.", rating: 5, date: "Verified Patient", treatment: "Dental Implants" },
    { name: "Priya Sharma", review: "My child felt so relaxed. Best pediatric dental checkup we have ever experienced.", rating: 5, date: "Verified Patient", treatment: "Pediatric Dentistry" },
    { name: "Amit Patel", review: "No pushy upselling, very conservative filling treatment. Transparent pricing too.", rating: 5, date: "Verified Patient", treatment: "Dental Fillings" },
    { name: "Rohan Das", review: "Clear aligner process was smooth. Highly recommend their modern scanning technique.", rating: 5, date: "Verified Patient", treatment: "Clear Aligners" },
    { name: "Meera Nair", review: "Best clinic hygiene standard I've seen. Autoclave logs are updated daily and visible.", rating: 5, date: "Verified Patient", treatment: "Routine Check Up" }
  ];

  // Dynamic Lists with initial hardcoded fallbacks
  const [faqsList, setFaqsList] = useState(faqs);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);
  const [galleryList, setGalleryList] = useState([]);

  useEffect(() => {
    // 1. Fetch Settings for phone fallback
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/content/settings");
        const data = await res.json();
        if (res.ok && data.success) {
          setSettings(data.data);
        }
      } catch (err) {
        console.error("Settings load error:", err);
      }
    };
    fetchSettings();

    // 2. Fetch FAQs
    if (slug === "faqs") {
      const fetchFaqs = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/content/faqs");
          const data = await res.json();
          if (res.ok && data.success && data.data.length > 0) {
            setFaqsList(data.data.map(f => ({ q: f.question, a: f.answer })));
          }
        } catch (err) {
          console.error("Faqs load error:", err);
        }
      };
      fetchFaqs();
    }

    // 3. Fetch Testimonials
    if (slug === "testimonials") {
      const fetchTestimonials = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/content/testimonials");
          const data = await res.json();
          if (res.ok && data.success && data.data.length > 0) {
            setTestimonialsList(data.data.map(t => ({
              name: t.patientName,
              review: t.comment,
              rating: t.rating,
              date: "Verified Patient",
              treatment: "General Dentistry"
            })));
          }
        } catch (err) {
          console.error("Testimonials load error:", err);
        }
      };
      fetchTestimonials();
    }

    // 4. Fetch Gallery
    if (slug === "gallery") {
      const fetchGallery = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/content/gallery");
          const data = await res.json();
          if (res.ok && data.success) {
            setGalleryList(data.data);
          }
        } catch (err) {
          console.error("Gallery load error:", err);
        }
      };
      fetchGallery();
    }
  }, [slug]);

  // Setup GSAP scroll animations
  useEffect(() => {
    let ctx = gsap.context(() => {
      // Lazy load fade-up elements
      gsap.utils.toArray(".animate-fade-up").forEach((elem) => {
        gsap.fromTo(
          elem,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: elem,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Staggered list items
      gsap.utils.toArray(".animate-stagger-parent").forEach((parent) => {
        gsap.fromTo(
          parent.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: parent,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [slug, faqsList, testimonialsList, galleryList]);

  // 3. Render functions for different sections
  if (slug === "faqs") {
    return (
      <div ref={containerRef} className="w-full bg-background text-[#1E293B] bg-dot-pattern">
        {/* Back button */}
        <div className="bg-white border-b border-border/30 py-3">
          <Container>
            <button onClick={() => router.push("/")} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              <ArrowLeft className="size-3.5" />
              <span>Back to home</span>
            </button>
          </Container>
        </div>

        <Section size="md" className="bg-white">
          <Container className="max-w-3xl animate-fade-up">
            <div className="text-center mb-12">
              <HelpCircle className="size-10 text-primary mx-auto mb-3" />
              <h1 className="text-3xl font-heading font-semibold text-foreground tracking-tight">Frequently Asked Questions</h1>
              <p className="text-sm text-muted-foreground mt-2">Find quick answers about our procedures, bookings, and policies.</p>
            </div>

            <div className="flex flex-col gap-4 animate-stagger-parent">
              {faqsList.map((faq, idx) => (
                <Card 
                  key={idx} 
                  className={cn(
                    "p-5 border cursor-pointer transition-all duration-300 rounded-xl bg-white",
                    activeFaq === idx ? "border-primary shadow-soft" : "border-slate-100 hover:border-slate-200"
                  )}
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                >
                  <div className="flex justify-between items-center w-full">
                    <h4 className="font-heading font-semibold text-base text-slate-800 leading-snug">{faq.q}</h4>
                    <span className="text-primary font-bold text-lg">{activeFaq === idx ? "−" : "+"}</span>
                  </div>
                  {activeFaq === idx && (
                    <p className="text-sm text-slate-600 font-light mt-3 leading-relaxed border-t border-slate-50 pt-3">
                      {faq.a}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  if (slug === "testimonials") {
    return (
      <div ref={containerRef} className="w-full bg-background text-[#1E293B] bg-dot-pattern">
        {/* Back button */}
        <div className="bg-white border-b border-border/30 py-3">
          <Container>
            <button onClick={() => router.push("/")} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              <ArrowLeft className="size-3.5" />
              <span>Back to home</span>
            </button>
          </Container>
        </div>

        <Section size="md" className="bg-white">
          <Container className="animate-fade-up">
            <div className="text-center mb-12">
              <Star className="size-10 text-primary mx-auto mb-3 fill-primary/10" />
              <h1 className="text-3xl font-heading font-semibold text-foreground tracking-tight">Patient Testimonials</h1>
              <p className="text-sm text-muted-foreground mt-2">Real feedback from patients who completed treatments at Aura Dental.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger-parent">
              {testimonialsList.map((t, idx) => (
                <Card key={idx} className="p-5 border border-slate-100 rounded-xl bg-white hover:border-primary/30 hover:shadow-soft transition-all duration-300 flex flex-col justify-between h-48 text-left">
                  <div>
                    <div className="flex gap-0.5 text-amber-500 mb-3">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="size-3.5 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <p className="italic font-light text-slate-600 text-sm leading-relaxed mb-4">
                      &ldquo;{t.review}&rdquo;
                    </p>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-800">{t.name}</h4>
                      <p className="text-xs text-muted-foreground font-light">{t.date}</p>
                    </div>
                    <Badge className="bg-light-green/60 text-primary hover:bg-light-green border-none text-[10px] font-semibold py-0.5 px-2 rounded-full uppercase">
                      {t.treatment}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  if (slug === "insurance-payment") {
    const benefits = [
      "Easy Monthly Installments",
      "Instant Loan Assistance",
      "RBI Approved Finance Partners",
      "Hassle-Free Documentation",
      "Affordable Payment Plans",
      "Quick Approval Process"
    ];

    return (
      <div ref={containerRef} className="w-full bg-background text-[#1E293B] bg-dot-pattern">
        {/* Back button */}
        <div className="bg-white border-b border-border/30 py-3">
          <Container>
            <button onClick={() => router.push("/")} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              <ArrowLeft className="size-3.5" />
              <span>Back to home</span>
            </button>
          </Container>
        </div>

        {/* Hero Section */}
        <Section size="md" className="bg-white border-b border-border/30">
          <Container className="max-w-4xl text-center animate-fade-up">
            <h1 className="text-3xl sm:text-4xl font-heading font-semibold text-foreground tracking-tight leading-[1.1]">
              Affordable Dental Care Made Easy
            </h1>
            <p className="mt-4 text-sm text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              At Aura Dental, we make advanced dental treatments easier to begin with EMI and insurance support through trusted RBI-approved banking and finance partners.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <a href="#emi-details" className={cn(buttonVariants({ size: "lg" }), "bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold rounded-lg")}>
                Check EMI Options
              </a>
              <a href={`tel:${settings?.phone ? settings.phone.replace(/[^+\d]/g, "") : "+15550192834"}`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-border text-foreground rounded-lg")}>
                Talk to Our Team
              </a>
            </div>
          </Container>
        </Section>

        {/* Content Section */}
        <Section id="emi-details" size="md" className="bg-alt-background border-b border-border/30">
          <Container className="animate-fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Card */}
              <div className="lg:col-span-5 flex">
                <Card className="bg-[#1e3a8a] text-white p-8 rounded-2xl flex flex-col justify-between text-left shadow-soft w-full">
                  <div>
                    <h3 className="text-lg font-heading font-semibold mb-3">Start Treatment Without Delay</h3>
                    <p className="text-sm text-white/80 font-light leading-relaxed">
                      High-value treatments can be managed comfortably with flexible monthly installments, so you do not need to postpone important dental care.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mt-8">
                    <div className="bg-white/10 rounded-lg p-3 text-center border border-white/5">
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-white/95">Easy</h5>
                      <p className="text-xs text-white/70 font-light mt-1">Monthly Payments</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center border border-white/5">
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-white/95">Fast</h5>
                      <p className="text-xs text-white/70 font-light mt-1">Loan Support</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center border border-white/5">
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-white/95">Trusted</h5>
                      <p className="text-xs text-white/70 font-light mt-1">Finance Partners</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Card / List */}
              <div className="lg:col-span-7 flex flex-col justify-center text-left bg-white border border-slate-100 p-8 rounded-2xl shadow-soft">
                <h3 className="text-lg font-heading font-semibold text-slate-800 mb-6">Benefits of EMI Dental Plans</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex gap-2.5 items-center text-sm font-light text-slate-700">
                      <CheckCircle2 className="size-4 text-primary shrink-0 animate-none" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  if (slug === "insights") {
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

    return (
      <div ref={containerRef} className="w-full bg-background text-[#1E293B] bg-dot-pattern">
        {/* Back button */}
        <div className="bg-white border-b border-border/30 py-3">
          <Container>
            <button onClick={() => router.push("/")} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              <ArrowLeft className="size-3.5" />
              <span>Back to home</span>
            </button>
          </Container>
        </div>

        <Section size="md" className="bg-white">
          <Container className="animate-fade-up">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-heading font-semibold text-foreground tracking-tight">Dental Insights by Aura Dental</h1>
              <p className="text-sm text-muted-foreground mt-2">Read clinical health articles written directly by our doctors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-stagger-parent">
              {articles.map((art, idx) => (
                <Card key={idx} variant="default" className="p-5 border border-border/60 bg-white rounded-xl flex flex-col justify-between hover:border-primary hover:shadow-soft transition-all duration-300 text-left group hover:-translate-y-0.5">
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-light-green/70 px-2 py-0.5 rounded">{art.tag}</span>
                    <h4 className="font-semibold text-sm md:text-base text-foreground mt-3 group-hover:text-primary leading-snug transition-colors">{art.title}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground font-light mt-2 leading-relaxed">{art.desc}</p>
                  </div>
                  <a href="#book" className="text-xs text-primary hover:underline font-semibold mt-5 flex items-center gap-0.5">
                    <span>Read Guide →</span>
                  </a>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  if (slug === "gallery") {
    return (
      <div ref={containerRef} className="w-full bg-background text-[#1E293B] bg-dot-pattern">
        {/* Back button */}
        <div className="bg-white border-b border-border/30 py-3">
          <Container>
            <button onClick={() => router.push("/")} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              <ArrowLeft className="size-3.5" />
              <span>Back to home</span>
            </button>
          </Container>
        </div>

        <Section size="md" className="bg-white">
          <Container className="animate-fade-up">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-heading font-semibold text-foreground tracking-tight">Smile Gallery</h1>
              <p className="text-sm text-muted-foreground mt-2">Clinical results and smiles achieved at {settings?.clinicName || "Aura Dental"}.</p>
            </div>

            {galleryList.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p>No gallery images uploaded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-stagger-parent">
                {galleryList.map((img, idx) => (
                  <div key={idx} className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-soft group bg-muted text-left">
                    <img
                      src={img.imageUrl}
                      alt={img.title || "Gallery Showcase"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-4 flex items-end">
                      <div>
                        <p className="text-xs font-bold text-sky-400 uppercase tracking-wider">{img.category}</p>
                        <h4 className="text-sm font-semibold text-white mt-1">{img.title || "Clinic Showcase"}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Container>
        </Section>
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-alt-background">
      <h1 className="text-3xl font-heading font-semibold text-foreground mb-4">Page Not Found</h1>
      <Link href="/" className={cn(buttonVariants({ size: "sm" }), "bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold rounded-lg")}>
        Back to Home
      </Link>
    </div>
  );
}
