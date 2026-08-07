"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  BookOpen, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  Tag,
  Phone,
  CalendarCheck,
  ChevronRight
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/motion";

const BLOG_POSTS = [
  {
    id: "brighter-whiter-teeth",
    title: "5 Simple Tips for Brighter, Whiter Teeth",
    excerpt: "Achieving a bright, white smile doesn't have to be complicated. Learn these five daily habits and professional solutions to boost your confidence.",
    content: (
      <>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
          A bright, white smile is one of the first things people notice about you. While genetics and aging play a role in the shade of your teeth, daily habits make a massive difference. Here are five simple, effective ways to keep your teeth looking pearly white.
        </p>

        <h4 className="text-xl font-heading font-semibold text-slate-900 dark:text-white mt-8 mb-4">
          1. Practice Proper Brushing and Flossing
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
          It sounds basic, but consistency is key. Brush your teeth at least twice a day for two full minutes. Flossing daily is equally crucial; it removes plaque and staining agents from between your teeth where your toothbrush can't reach.
        </p>

        <h4 className="text-xl font-heading font-semibold text-slate-900 dark:text-white mt-8 mb-4">
          2. Watch What You Eat and Drink
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
          Dark-colored beverages like coffee, red wine, black tea, and colas are notorious for staining teeth. If you do consume them, try drinking through a straw to limit contact with your front teeth, and rinse your mouth with water immediately afterward.
        </p>

        <h4 className="text-xl font-heading font-semibold text-slate-900 dark:text-white mt-8 mb-4">
          3. Incorporate Crunchy Fruits and Vegetables
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
          Apples, celery, and carrots act like natural toothbrushes. Eating them stimulates saliva production, which cleanses your mouth, neutralizes acids, and helps scrub away surface particles.
        </p>

        <h4 className="text-xl font-heading font-semibold text-slate-900 dark:text-white mt-8 mb-4">
          4. Quit Tobacco Products
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
          Smoking and chewing tobacco lead to deep, stubborn yellow or brown stains that are incredibly difficult to remove. Quitting tobacco is one of the single best decisions you can make for both your smile and your systemic health.
        </p>

        <h4 className="text-xl font-heading font-semibold text-slate-900 dark:text-white mt-8 mb-4">
          5. Invest in Professional Whitening
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
          Over-the-counter whitening strips can help, but professional in-office whitening offers the safest, most dramatic results. Using advanced, enamel-safe bleaching gels activated by light, we can brighten your smile by up to eight shades in a single appointment.
        </p>

        <div className="bg-light-green/20 border border-light-green/45 rounded-xl p-5 mt-8 mb-8">
          <p className="text-xs font-semibold text-[#0F2D1D] dark:text-[#84cc16]">PRO TIP</p>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-light">
            Wait at least 30 minutes after consuming acidic foods or drinks (like citrus or wine) before brushing. Acid softens your enamel, and brushing immediately can erode it.
          </p>
        </div>
      </>
    ),
    category: "Cosmetic",
    date: "August 6, 2026",
    author: "Dr. Eleanor Vance",
    readTime: "4 min read",
    image: "/images/teeth_whitening.png"
  },
  {
    id: "understanding-dental-implants",
    title: "Understanding Dental Implants: Procedure and Benefits",
    excerpt: "Missing teeth can impact your self-esteem and dental health. Explore why dental implants are the gold standard for long-term tooth replacement.",
    content: (
      <>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
          Losing a tooth due to injury, decay, or gum disease is a common problem. Fortunately, modern restorative dentistry offers a solution that behaves, feels, and looks exactly like a natural tooth: the dental implant.
        </p>

        <h4 className="text-xl font-heading font-semibold text-slate-900 dark:text-white mt-8 mb-4">
          What is a Dental Implant?
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
          Unlike bridges or dentures, which sit on top of the gums, a dental implant replaces the entire structure of the tooth, including the root. It consists of a tiny titanium post inserted into the jawbone, an abutment, and a custom-designed porcelain crown.
        </p>

        <h4 className="text-xl font-heading font-semibold text-slate-900 dark:text-white mt-8 mb-4">
          The Implant Procedure: What to Expect
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
          The process occurs in a few phases to allow proper healing:
        </p>
        <ul className="list-disc pl-6 text-sm text-slate-600 dark:text-slate-300 space-y-2 mb-6 font-light">
          <li><strong>Initial Consultation:</strong> Comprehensive 3D imaging evaluates your bone structure and planning.</li>
          <li><strong>Placement:</strong> The titanium post is surgically placed in the jawbone under comfortable local anesthesia.</li>
          <li><strong>Osseointegration:</strong> Over 3 to 6 months, your bone naturally fuses with the titanium post, creating an unbreakable anchor.</li>
          <li><strong>Restoration:</strong> An abutment is attached, followed by the placement of your custom crown.</li>
        </ul>

        <h4 className="text-xl font-heading font-semibold text-slate-900 dark:text-white mt-8 mb-4">
          Key Benefits of Dental Implants
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
          Implants offer unparalleled benefits compared to traditional tooth replacement:
        </p>
        <ul className="list-disc pl-6 text-sm text-slate-600 dark:text-slate-300 space-y-2 mb-6 font-light">
          <li><strong>Preserve Bone Structure:</strong> Missing roots trigger jawbone deterioration. Implants stimulate the bone, preventing facial sagging.</li>
          <li><strong>Protect Adjacent Teeth:</strong> Traditional bridges require grinding down neighboring healthy teeth. Implants stand independently.</li>
          <li><strong>Unmatched Durability:</strong> With proper hygiene, implants can last a lifetime, whereas bridges usually require replacement every 10–15 years.</li>
        </ul>
      </>
    ),
    category: "Restorative",
    date: "July 29, 2026",
    author: "Dr. Adrian Carter",
    readTime: "6 min read",
    image: "/images/implant_graphic.png"
  },
  {
    id: "how-often-dentist-visit",
    title: "How Often Should You Visit the Dentist?",
    excerpt: "Is the 'twice-a-year' rule actually necessary for everyone? Learn how preventive dental visits shield your teeth and systemic health.",
    content: (
      <>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
          We've all heard the rule of thumb: you should visit the dentist every six months. But is this bi-annual recommendation truly necessary for everyone, or does it vary? Let's take a look at why cleanings matter and who might need more frequent visits.
        </p>

        <h4 className="text-xl font-heading font-semibold text-slate-900 dark:text-white mt-8 mb-4">
          The Purpose of Regular Cleanings
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
          Even if you brush and floss meticulously, plaque eventually hardens into tartar (calculus). Tartar cannot be removed by home brushing; only a dental hygienist using specialized scaling tools can clean it off. If left on your teeth, tartar inflames your gums, leading to gingivitis and eventually periodontal disease.
        </p>

        <h4 className="text-xl font-heading font-semibold text-slate-900 dark:text-white mt-8 mb-4">
          The 6-Month Standard
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
          For individuals with excellent oral health, strong enamel, and low risk of decay, twice-a-year checkups are ideal. It allows your dentist to catch small cavities before they turn into root canals, scan for oral cancers, and evaluate overall gum stability.
        </p>

        <h4 className="text-xl font-heading font-semibold text-slate-900 dark:text-white mt-8 mb-4">
          Who Needs More Frequent Visits?
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
          Some patients fall into high-risk categories and benefit from checkups every 3 to 4 months:
        </p>
        <ul className="list-disc pl-6 text-sm text-slate-600 dark:text-slate-300 space-y-2 mb-6 font-light">
          <li><strong>Smokers:</strong> Tobacco dramatically increases your risk of gum disease and slows down healing.</li>
          <li><strong>Diabetics:</strong> Fluctuations in blood sugar render you more susceptible to oral infections.</li>
          <li><strong>Pregnant Women:</strong> Hormonal shifts can trigger 'pregnancy gingivitis'.</li>
          <li><strong>History of Gum Disease:</strong> Periodontitis requires ongoing maintenance therapies to keep pocket depths controlled.</li>
        </ul>
      </>
    ),
    category: "Preventive",
    date: "July 15, 2026",
    author: "Dr. Eleanor Vance",
    readTime: "5 min read",
    image: "/images/patient_smile.png"
  },
  {
    id: "pediatric-dental-care-guide",
    title: "A Parent's Guide to Pediatric Dental Care",
    excerpt: "Building healthy brushing routines early sets your child up for a lifetime of bright smiles. Discover tips for stress-free first visits.",
    content: (
      <>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
          Caring for your child's teeth begins long before their permanent adult teeth arrive. Healthy baby teeth are vital for speaking, chewing, and holding correct alignment spaces for future adult teeth. Here is how to navigate early dental milestones.
        </p>

        <h4 className="text-xl font-heading font-semibold text-slate-900 dark:text-white mt-8 mb-4">
          When to Schedule the First Dental Visit
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
          The general recommendation is: **First tooth, first visit.** Schedule a brief checkup within six months of their first tooth erupting, or by their first birthday. This initial visit is mainly about acclimating your child to the dental clinic environment and counseling parents on nutrition and brushing.
        </p>

        <h4 className="text-xl font-heading font-semibold text-slate-900 dark:text-white mt-8 mb-4">
          How to Clean Baby Teeth
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
          Before teeth appear, wipe your baby's gums with a clean, damp cloth after feedings. Once teeth emerge, use a soft-bristled baby toothbrush. For children under three, use a tiny smear of fluoride toothpaste (no bigger than a grain of rice). For children three to six, increase to a pea-sized amount.
        </p>

        <h4 className="text-xl font-heading font-semibold text-slate-900 dark:text-white mt-8 mb-4">
          Preventing Baby Bottle Tooth Decay
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-light">
          Avoid letting your infant go to sleep with a bottle containing milk, formula, juice, or sweetened liquids. The sugars pool around the teeth for hours, feeding decay-causing bacteria and causing rapid tooth enamel erosion.
        </p>
      </>
    ),
    category: "Pediatric",
    date: "June 28, 2026",
    author: "Dr. Sophia Patel",
    readTime: "4 min read",
    image: "/images/kids_dental.png"
  }
];

export default function BlogPage() {
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get categories and counts
  const categoryCounts = useMemo(() => {
    const counts = { All: BLOG_POSTS.length };
    BLOG_POSTS.forEach((post) => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    return counts;
  }, []);

  const categories = Object.keys(categoryCounts);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "All" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const selectedPost = useMemo(() => {
    return BLOG_POSTS.find((p) => p.id === selectedPostId);
  }, [selectedPostId]);

  return (
    <div className="bg-slate-50/50 dark:bg-[#070b15] min-h-screen">
      {/* Page Header */}
      <section className="relative overflow-hidden bg-[#0F2D1D] text-white py-16 md:py-20">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#84cc16] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-3xl text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#84cc16] mb-3 inline-block">
              Dental Insights & Tips
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight leading-tight">
              Knowledge for Better Oral Health
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
              Explore professional articles, tips, and guidelines curated by our leading dental specialists to maintain your bright smile.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content Area */}
      <Section className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT COLUMN: Main content (List or Details) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {selectedPost ? (
                /* DETAIL VIEW */
                <article className="bg-white dark:bg-[#0a0f1d] border border-slate-100 dark:border-white/[0.04] rounded-2xl p-6 md:p-10 shadow-premium text-left">
                  <button 
                    onClick={() => setSelectedPostId(null)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#84cc16] transition-colors duration-200 mb-6 group"
                  >
                    <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                    <span>Back to Articles</span>
                  </button>

                  {/* Meta Tags */}
                  <div className="flex flex-wrap gap-4 items-center text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <span className="bg-[#84cc16]/10 text-[#84cc16] border border-[#84cc16]/15 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                      {selectedPost.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      {selectedPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {selectedPost.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-heading font-semibold text-slate-900 dark:text-white mb-6">
                    {selectedPost.title}
                  </h2>

                  {/* Feature Image */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 bg-slate-100 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05]">
                    <Image
                      src={selectedPost.image}
                      alt={selectedPost.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Article content */}
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    {selectedPost.content}
                  </div>

                  {/* Author Box */}
                  <div className="border-t border-slate-100 dark:border-white/[0.04] pt-8 mt-10 flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-[#84cc16] uppercase border border-slate-300 dark:border-white/[0.08] shadow-inner text-sm shrink-0">
                      {selectedPost.author.charAt(4)}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Written by</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{selectedPost.author}</p>
                    </div>
                  </div>
                </article>
              ) : (
                /* LIST VIEW */
                <div className="flex flex-col gap-8">
                  {/* Search and results info */}
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#0a0f1d] border border-slate-100 dark:border-white/[0.04] p-4 rounded-xl shadow-xs">
                    <div className="relative w-full md:max-w-xs">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-100 dark:border-white/[0.05] bg-slate-50 dark:bg-[#070b15] rounded-lg text-xs outline-none focus:border-[#84cc16] focus:ring-1 focus:ring-[#84cc16] transition-all"
                      />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Showing {filteredPosts.length} article{filteredPosts.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  {/* Blog post grid */}
                  {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {filteredPosts.map((post) => (
                        <div 
                          key={post.id}
                          className="bg-white dark:bg-[#0a0f1d] rounded-2xl border border-slate-100 dark:border-white/[0.04] p-5 shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between group text-left"
                        >
                          <div>
                            {/* Card Image */}
                            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05]">
                              <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 25vw"
                              />
                              <div className="absolute top-3 left-3 bg-[#84cc16]/90 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                                {post.category}
                              </div>
                            </div>

                            {/* Card Meta */}
                            <div className="flex gap-4 text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                {post.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {post.readTime}
                              </span>
                            </div>

                            {/* Card Title */}
                            <h3 className="text-lg font-heading font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#84cc16] transition-colors duration-200">
                              {post.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="mt-2 text-xs font-light text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                              {post.excerpt}
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.04]">
                            <button
                              onClick={() => {
                                setSelectedPostId(post.id);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="w-full flex items-center justify-between text-xs font-semibold text-[#84cc16] group/btn hover:text-[#65a30d]"
                            >
                              <span>Read Full Article</span>
                              <ArrowRight className="size-3.5 transform transition-transform duration-200 group-hover/btn:translate-x-1" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-white dark:bg-[#0a0f1d] border border-slate-100 dark:border-white/[0.04] rounded-2xl">
                      <BookOpen className="size-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white">No articles found</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto font-light">
                        We couldn't find any articles matching your search criteria. Try modifying your filters or terms.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Sidebar (Widgets) */}
            <aside className="lg:col-span-4 flex flex-col gap-8 text-left">
              {/* About Widget */}
              <div className="bg-white dark:bg-[#0a0f1d] border border-slate-100 dark:border-white/[0.04] p-6 rounded-2xl shadow-premium">
                <h4 className="text-sm font-heading font-semibold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-white/[0.04] pb-3 mb-4">
                  About Our Blog
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                  Aura Dental Blog is an educational initiative dedicated to demystifying clinical treatments and delivering trusted, evidence-based guidelines on oral health directly to our patients.
                </p>
              </div>

              {/* Categories Widget */}
              <div className="bg-white dark:bg-[#0a0f1d] border border-slate-100 dark:border-white/[0.04] p-6 rounded-2xl shadow-premium">
                <h4 className="text-sm font-heading font-semibold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-white/[0.04] pb-3 mb-4">
                  Dental Categories
                </h4>
                <div className="flex flex-col gap-2">
                  {categories.map((category) => {
                    const isSelected = selectedCategory === category;
                    return (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setSelectedPostId(null); // Return to list view
                        }}
                        className={cn(
                          "w-full flex items-center justify-between text-xs font-semibold px-3 py-2.5 rounded-lg border transition-all text-left",
                          isSelected 
                            ? "bg-light-green/45 text-primary border-light-green/60" 
                            : "border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.01]"
                        )}
                      >
                        <span>{category}</span>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0",
                          isSelected 
                            ? "bg-[#84cc16] text-white" 
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        )}>
                          {categoryCounts[category]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Popular Articles Widget */}
              <div className="bg-white dark:bg-[#0a0f1d] border border-slate-100 dark:border-white/[0.04] p-6 rounded-2xl shadow-premium">
                <h4 className="text-sm font-heading font-semibold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-white/[0.04] pb-3 mb-4">
                  Popular Tips
                </h4>
                <div className="flex flex-col gap-4">
                  {BLOG_POSTS.slice(0, 3).map((post) => (
                    <button
                      key={post.id}
                      onClick={() => {
                        setSelectedPostId(post.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="group flex gap-3 text-left w-full cursor-pointer items-start"
                    >
                      <div className="relative size-12 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-[#84cc16] transition-colors duration-200 line-clamp-2 leading-tight">
                          {post.title}
                        </h5>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 font-light flex items-center gap-1">
                          <Calendar className="size-2.5" />
                          {post.date}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sidebar Booking CTA Widget */}
              <div className="bg-[#0F2D1D] text-white p-6 rounded-2xl shadow-premium border border-[#84cc16]/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#84cc16]/10 rounded-full blur-2xl pointer-events-none" />
                <h4 className="text-sm font-heading font-semibold text-[#84cc16] uppercase tracking-wider">
                  Need Professional Care?
                </h4>
                <p className="text-xs font-light text-slate-300 mt-2 leading-relaxed">
                  Book a custom consultation with one of our specialized dentists for custom smile mapping and treatment options.
                </p>
                <a
                  href="/#book"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "w-full mt-5 bg-[#84cc16] hover:bg-[#65a30d] text-white font-semibold rounded-lg flex items-center justify-center gap-2 py-2"
                  )}
                >
                  <CalendarCheck className="size-4" />
                  <span>Book Appointment</span>
                </a>
              </div>
            </aside>

          </div>
        </Container>
      </Section>
    </div>
  );
}
