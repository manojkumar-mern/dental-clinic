"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { treatmentsDetailData } from "@/constants/treatmentsData";

export default function ServicesPage() {
  const services = Object.entries(treatmentsDetailData).map(([slug, data]) => ({
    slug,
    title: data.title,
    img: data.img,
    desc: data.heroDesc,
  }));

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

      {/* Hero */}
      <Section size="md" className="pt-12 pb-10 bg-white bg-grid-pattern border-b border-border/40">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-widest text-primary bg-light-green/75 px-3 py-1 rounded-full uppercase">
              Complete Care Catalog
            </span>
            <h1 className="text-3xl sm:text-4xl font-heading font-semibold text-foreground tracking-tight mt-4">
              All Our Dental Services
            </h1>
            <p className="text-sm text-muted-foreground font-light mt-2 leading-relaxed">
              Explore every treatment we offer. Book a consultation and our care coordinator will match you with the right clinical pathway.
            </p>
          </div>
        </Container>
      </Section>

      {/* Services Grid */}
      <Section size="md" className="bg-alt-background border-b border-border/30">
        <Container>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <StaggerItem key={s.slug} className="h-full">
                <Link
                  href={`/treatments/${s.slug}`}
                  className="group flex flex-col h-full rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-soft hover:shadow-premium hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-40 overflow-hidden bg-slate-50">
                    <Image
                      src={s.img}
                      alt={s.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="font-heading font-semibold text-sm text-slate-800 leading-snug group-hover:text-primary transition-colors">
                      {s.title}
                    </h2>
                    <p className="text-xs text-slate-500 font-light mt-2 leading-relaxed line-clamp-3">{s.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      View Details
                      <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* CTA */}
          <FadeUp className="flex flex-col items-center gap-4 text-center mt-12">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-light">
              <ShieldCheck className="size-4 text-primary" />
              <span>Every plan is tailored to your clinical needs.</span>
            </div>
            <Link
              href="/#book"
              className={cn(buttonVariants({ size: "lg" }), "bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold rounded-lg shadow-sm px-8")}
            >
              Book a Consultation
            </Link>
          </FadeUp>
        </Container>
      </Section>
    </div>
  );
}
