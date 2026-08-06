"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FadeUp, SlideInRight, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { 
  CheckCircle2, 
  ChevronRight, 
  Phone, 
  Calendar, 
  ArrowLeft,
  ShieldCheck,
  Stethoscope,
  Smile,
  Shield,
  Activity,
  Heart
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card, CardContent } from "@/components/cards";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { treatmentsDetailData } from "@/constants/treatmentsData";

export default function TreatmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const data = treatmentsDetailData[slug];

  if (!data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-alt-background">
        <h1 className="text-3xl font-heading font-semibold text-foreground mb-4">Treatment Not Found</h1>
        <p className="text-sm text-muted-foreground mb-6">The requested treatment clinical pathway does not exist or has been moved.</p>
        <Link href="/#treatments" className={cn(buttonVariants({ size: "sm" }), "bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold rounded-lg shadow-sm")}>
          Back to Treatments
        </Link>
      </div>
    );
  }

  // Why choose details for bottom section
  const whyChoosePoints = [
    { title: "Active & Experienced Specialists", desc: "Our board-certified dentists have performed hundreds of successful procedures with state-of-the-art diagnostic scans." },
    { title: "Modern Equipment & Digital Technology", desc: "We use low-radiation imaging, CAD/CAM restoration mappings, and suture-free precision soft-tissue lasers." },
    { title: "Focus on Patient Friendly Care", desc: "We prioritize patient relief with daily emergency blocks and gentle, conservative dental guidelines." },
    { title: "Clean & Sterilized Environment", desc: "Our clinical rooms utilize medical-grade air filtration and multi-cycle autoclave sterilization matching top guidelines." },
    { title: "Transparent & Affordable Pricing", desc: "No hidden charges or pushy upselling. We recommend only essential dental procedures to protect your enamel." }
  ];

  return (
    <div className="w-full bg-background text-[#1E293B] bg-dot-pattern">
      {/* Back button */}
      <div className="bg-white border-b border-border/30 py-3">
        <Container>
          <button 
            onClick={() => router.push("/#treatments")} 
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to clinical treatments</span>
          </button>
        </Container>
      </div>

      {/* 1. HERO SECTION */}
      <Section size="md" className="pt-12 pb-12 bg-white bg-grid-pattern border-b border-border/40">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left */}
            <StaggerContainer className="lg:col-span-7 text-left flex flex-col items-start">
              <StaggerItem className="text-[10px] font-bold tracking-widest text-primary bg-light-green/50 px-3 py-1 rounded-full uppercase mb-4">
                ★ Clinical Pathway
              </StaggerItem>
              <StaggerItem>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-semibold text-foreground tracking-tight leading-[1.08] max-w-xl">
                  {data.tagline}
                </h1>
              </StaggerItem>
              <StaggerItem>
                <p className="mt-4 text-sm text-muted-foreground font-light max-w-md leading-relaxed">
                  {data.heroDesc}
                </p>
              </StaggerItem>
              
              <StaggerItem className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a href="#book" className={cn(buttonVariants({ size: "lg" }), "bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold rounded-lg shadow-sm")}>
                  Book Consultation Today
                </a>
                <a href="tel:+15550192834" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-border text-foreground hover:bg-alt-background rounded-lg flex items-center justify-center gap-2")}>
                  <Phone className="size-4 text-primary" />
                  <span>Call (555) 019-2834</span>
                </a>
              </StaggerItem>
            </StaggerContainer>

            {/* Right */}
            <SlideInRight className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-[4/4] rounded-2xl overflow-hidden border border-border shadow-soft bg-muted group">
                <Image
                  src={data.img}
                  alt={data.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </SlideInRight>
          </div>
        </Container>
      </Section>

      {/* 2. WHY CHOOSE THIS CLINICAL OPTION */}
      <Section size="md" className="bg-alt-background border-b border-border/30">
        <Container>
          <FadeUp className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-foreground tracking-tight">{data.whyBestTitle}</h2>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.whyBestPoints.map((point, idx) => (
              <StaggerItem key={idx}>
                <Card className="p-5 border border-slate-100 bg-white rounded-xl shadow-soft flex flex-col items-start hover:border-primary/20 hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full">
                  <CheckCircle2 className="size-5 text-primary mb-3 shrink-0" />
                  <h3 className="font-heading font-semibold text-base text-slate-800 leading-snug mb-1.5">{point.title}</h3>
                  <p className="text-xs md:text-sm text-slate-500 font-light leading-relaxed">{point.desc}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* 3. TYPES OF SOLUTIONS */}
      <Section size="md" className="bg-white border-b border-border/30">
        <Container>
          <FadeUp className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-foreground tracking-tight">{data.solutionsTitle}</h2>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.solutions.map((sol, idx) => (
              <StaggerItem key={idx}>
                <Card className="p-5 border border-slate-100 bg-white rounded-xl shadow-soft hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col justify-between h-44 hover:-translate-y-1">
                  <div className="flex justify-between items-start w-full">
                    <span className="text-xs font-bold text-primary bg-light-green/60 px-2 py-0.5 rounded-full">{sol.id}</span>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-heading font-semibold text-sm md:text-base text-slate-800 leading-snug">{sol.title}</h4>
                    <p className="text-xs md:text-sm text-slate-500 font-light mt-1 leading-relaxed">{sol.desc}</p>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* 4. STEP-BY-STEP PROCEDURE */}
      <Section size="md" className="bg-alt-background border-b border-border/30">
        <Container>
          <FadeUp className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-foreground tracking-tight">{data.stepsTitle}</h2>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {data.steps.map((step, idx) => (
              <StaggerItem key={idx}>
                <Card className="p-5 border border-slate-100 bg-white rounded-xl shadow-soft flex flex-col items-start hover:border-primary/20 hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="size-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold mb-3">
                    {step.id}
                  </div>
                  <h4 className="font-heading font-semibold text-sm md:text-base text-slate-800 leading-snug mb-1">{step.name}</h4>
                  <p className="text-xs md:text-sm text-slate-500 font-light leading-relaxed">{step.desc}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* 5. WHY CHOOSE AURA DENTAL FOR IMPLANTS / TREATMENT */}
      <Section size="md" className="bg-white border-b border-border/30">
        <Container>
          <FadeUp className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-foreground tracking-tight">Why Choose Aura Dental for {data.title}?</h2>
          </FadeUp>

          <StaggerContainer className="max-w-2xl mx-auto flex flex-col gap-4">
            {whyChoosePoints.map((p, idx) => (
              <StaggerItem key={idx}>
                <Card className="p-4 border border-slate-100 bg-white rounded-xl shadow-soft hover:shadow-md transition-all duration-300 flex items-start gap-3 text-left hover:-translate-y-1">
                  <div className="size-6 rounded-full bg-light-green flex items-center justify-center text-primary shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-sm md:text-base text-slate-800 leading-snug">{p.title}</h4>
                    <p className="text-xs md:text-sm text-slate-500 font-light mt-0.5 leading-relaxed">{p.desc}</p>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* 6. BOOKING CONSULTATION */}
      <Section id="book" size="md" className="bg-alt-background border-b border-border/30 relative z-10">
        <Container className="max-w-3xl">
          <Card className="bg-white border border-border/60 p-6 sm:p-8 rounded-2xl shadow-soft">
            <div className="text-center mb-6">
              <h3 className="text-xl font-heading font-semibold text-foreground">Schedule Consultation for {data.title}</h3>
              <p className="text-xs text-muted-foreground font-light mt-1">Book your slot. Our care coordinator will call to verify details.</p>
            </div>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                type="date"
                required
                className="bg-white border border-border px-4 py-2.5 rounded-lg text-xs outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 sm:col-span-2"
              />
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Consultation booking received for " + data.title + "!");
                }}
                className="sm:col-span-2 py-3 bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold rounded-lg text-xs cursor-pointer shadow-soft transition-colors mt-2"
              >
                Book Consultation Now
              </button>
            </form>
          </Card>
        </Container>
      </Section>
    </div>
  );
}
