import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  GraduationCap, Globe, Trophy, CheckCircle2, Play, Linkedin, Instagram, Youtube,
  Mail, Phone, MapPin, Award, BarChart3, Target, ShieldAlert, Bot, ArrowRight,
  X, Quote, Sparkles, Compass, BookOpen, Briefcase, Building2, Users, Plus,
  Star, Download, ChevronRight, Menu,
} from "lucide-react";
import logo from "@/assets/mmi-logo.png";
import portrait from "@/assets/vijay-portrait.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useServerFn } from "@tanstack/react-start";
import { submitContact } from "@/lib/contact";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ---------------- helpers ---------------- */
const getYouTubeId = (url: string): string | null => {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  return m ? m[1] : null;
};
const thumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
const embed = (id: string, autoplay = false) =>
  `https://www.youtube.com/embed/${id}${autoplay ? "?autoplay=1" : ""}`;

/* ---------------- reveal on scroll ---------------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ---------------- scroll progress ---------------- */
function ScrollProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setW(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent">
      <div className="h-full bg-gradient-gold transition-[width] duration-100" style={{ width: `${w}%` }} />
    </div>
  );
}

/* ---------------- live webinar banner ---------------- */
function WebinarBanner() {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="sticky top-0 z-50 bg-gradient-gold text-navy">
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-medium">
        <span className="inline-block h-2 w-2 rounded-full bg-red-600 animate-pulse" />
        <span className="hidden sm:inline">🔴 LIVE MASTERCLASS:</span>
        <span>CPA, CMA & CIA Success Strategy + Global Finance Career Roadmap — </span>
        <a href="#contact" className="underline font-semibold">Register Now →</a>
        <button
          aria-label="Dismiss"
          onClick={() => setShow(false)}
          className="ml-2 p-1 rounded hover:bg-navy/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ---------------- navbar ---------------- */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["Home", "#home"],
    ["About MMI", "#about"],
    ["Expertise", "#expertise"],
    ["Programs", "#programs"],
    ["Video Lessons", "#videos"],
    ["Testimonials", "#testimonials"],
    ["Contact", "#contact"],
  ];
  return (
    <header
      className={`sticky top-0 z-40 transition-all ${scrolled ? "bg-white/95 backdrop-blur shadow-sm" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3">
          <img src={logo} alt="MMI Educator" className="h-12 w-12 rounded-lg" width={48} height={48} />
          <div className="leading-tight">
            <div className={`font-display text-xl font-bold ${scrolled ? "text-navy" : "text-white"}`}>MMI Educator</div>
            <div className="text-[11px] uppercase tracking-widest text-gold font-semibold">Vijay Narwani</div>
          </div>
        </a>
        <nav className="hidden lg:flex items-center gap-7">
          {links.map(([l, h]) => (
            <a key={h} href={h} className={`text-sm font-medium transition-colors hover:text-gold ${scrolled ? "text-navy/80" : "text-white"}`}>
              {l}
            </a>
          ))}
        </nav>
        <div className="hidden lg:block">
          <Button asChild variant="gold" size="lg">
            <a href="#contact">Book a Free Session</a>
          </Button>
        </div>
        <button className={`lg:hidden p-2 ${scrolled ? "text-navy" : "text-white"}`} onClick={() => setOpen((s) => !s)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-white border-t shadow-md">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {links.map(([l, h]) => (
              <a key={h} href={h} onClick={() => setOpen(false)} className="py-1.5 text-navy font-medium">
                {l}
              </a>
            ))}
            <Button asChild variant="gold">
              <a href="#contact">Book a Free Session</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------------- HERO ---------------- */
const INTRO_VIDEO_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
function Hero() {
  const introId = getYouTubeId(INTRO_VIDEO_URL) || "";
  return (
    <section id="home" className="relative bg-navy text-white overflow-hidden -mt-20 pt-20">
      <div className="absolute inset-0 globe-pattern" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="container mx-auto px-4 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center relative">
        <div className="reveal">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold tracking-wide">
            <Sparkles className="h-3.5 w-3.5" /> 26+ Years · 10,000+ Professionals Mentored
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.05]">
            From Certification to <span className="text-gold">C-Suite</span> Leadership —
            {/* <br />Build your future in global finance through expert-led mentorship, certification guidance and career-focused learning. */}
          </h1>
          <h3 className="mt-0 text-4xl md:text-5xl lg:text-3xl font-display font-bold leading-[1.05]">
            {/* From Certification to <span className="text-gold">C-Suite</span> Leadership — */}
            <br />Build your future in global finance through expert-led mentorship, certification guidance and career-focused learning.
          </h3>
          <p className="mt-6 text-lg text-white/80 max-w-xl">
            Vijay Narwani · CA | ACMA, CGMA | CPA | CISA | ICAEW Finalist · 26+ Years in CFO & Finance Leadership Across India, GCC & Global Markets
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild variant="gold" size="xl">
              <a href="#programs">Explore Programs <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outlineWhite" size="xl">
                  <Play className="mr-2 h-4 w-4 fill-current" /> Watch Mentor Introduction
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black border-0">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={embed(introId, true)}
                    title="Intro"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/75">
            <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-gold" /> India & GCC </span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-gold" /> 10,000+ Mentored</span>
            <span className="flex items-center gap-1.5"><Trophy className="h-4 w-4 text-gold" /> 26+ Years</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-gold" /> Global Finance Certifications</span>
          </div>
        </div>

        <div className="relative reveal flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-gold blur-2xl opacity-30 scale-110" />
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border-4 border-gold overflow-hidden shadow-gold bg-navy-deep">
              <img src={portrait} alt="Vijay Narwani" className="w-full h-full object-cover" width={400} height={400} />
            </div>
            {[
              { l: "CA | CPA | CISA", t: "-top-2 -left-6" },
              { l: "ACMA, CGMA", t: "top-1/2 -right-10" },
              { l: "26+ Yrs CFO Leadership", t: "-bottom-2 left-4" },
            ].map((b) => (
              <div key={b.l} className={`absolute ${b.t} bg-white text-navy rounded-full px-4 py-2 text-xs font-semibold shadow-elegant border border-gold/40`}>
                {b.l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- stats ---------------- */
function useCounter(target: number, on: boolean, duration = 1600) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) return;
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [on, target, duration]);
  return n;
}
function StatItem({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const n = useCounter(value, on);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-display font-bold text-gold">
        {n.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-sm text-white/75 uppercase tracking-wider">{label}</div>
    </div>
  );
}
function Stats() {
  return (
    <section className="bg-navy-deep text-white py-14 border-y border-white/5">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-10">
        <StatItem value={10000} suffix="+" label="Professionals Mentored" />
        <StatItem value={26} suffix="+" label="Years of Leadership Experience" />
        <StatItem value={7} label="Global Finance Certifications" />
        <StatItem value={3} label="India & GCC Presence" />
      </div>
    </section>
  );
}

/* ---------------- video hub ---------------- */
type Vid = { id: string; title: string; topic: string; duration: string };
const DEFAULT_VIDS: Vid[] = [
  { id: "dQw4w9WgXcQ", title: "Introduction to CPA Certification", topic: "CPA", duration: "12:34" },
  { id: "9bZkp7q19f0", title: "IFRS 15 — Revenue Recognition", topic: "IFRS", duration: "18:02" },
  { id: "kJQP7kiw5Fk", title: "Financial Modeling Fundamentals", topic: "FP&A", duration: "22:10" },
  { id: "L_jWHffIx5E", title: "ACCA Strategic Business Leader Prep", topic: "ACCA", duration: "16:45" },
  { id: "fJ9rUzIMcZQ", title: "CMA Part 1 — Cost Management", topic: "CMA", duration: "14:21" },
  { id: "OPf0YbXqDm0", title: "AI in Finance — Automation Trends", topic: "FinTech", duration: "20:08" },
];
const CATS = ["All", "CPA", "CMA", "ACCA", "IFRS", "FP&A", "FinTech"];

const CORPORATE_DOMAINS = [
  { icon: "🏭", label: "Manufacturing" },
  { icon: "🏗️", label: "EPC & Construction" },
  { icon: "🛢️", label: "Oil & Gas" },
  { icon: "📦", label: "Trading & Distribution" },
  { icon: "🔄", label: "Finance Transformation" },
  { icon: "🌍", label: "GCC Business Operations" },
  { icon: "📊", label: "IFRS & Global Reporting" },
  { icon: "⚙️", label: "ERP & Finance Automation" },
];

function CorporateExperience() {
  return (
    <section className="py-20 bg-navy text-white overflow-hidden relative">
      <div className="absolute inset-0 globe-pattern opacity-40" />
      <div className="container mx-auto px-4 relative">
        <div className="text-center reveal">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold tracking-wide uppercase">
            <Briefcase className="h-3.5 w-3.5" /> Corporate Experience
          </span>
          <h2 className="mt-4 font-display text-3xl md:text-4xl font-bold text-white">
            Real-World Industry Expertise
          </h2>
          <p className="mt-3 text-white/70 max-w-xl mx-auto">
            26+ years of hands-on CFO & finance leadership across diverse industries — bringing practical, boardroom-tested knowledge to every mentorship session.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 reveal">
          {CORPORATE_DOMAINS.map(({ icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-gold/40 transition-all group"
            >
              <span className="text-3xl">{icon}</span>
              <span className="text-sm font-semibold text-white/90 text-center leading-snug group-hover:text-gold transition-colors">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoHub() {
  const [videos, setVideos] = useState<Vid[]>(DEFAULT_VIDS);
  const [active, setActive] = useState<Vid>(DEFAULT_VIDS[0]);
  const [cat, setCat] = useState("All");

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("CPA");

  const filtered = useMemo(
    () => (cat === "All" ? videos : videos.filter((v) => v.topic === cat)),
    [cat, videos],
  );

  const addVideo = () => {
    const id = getYouTubeId(url);
    if (!id) {
      toast.error("Please paste a valid YouTube URL");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    const v: Vid = { id, title: title.trim(), topic, duration: "—" };
    setVideos((cur) => [v, ...cur]);
    setActive(v);
    setUrl(""); setTitle("");
    toast.success("Video added to playlist");
  };

  return (
    <section id="videos" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionLabel>Video Lessons</SectionLabel>
        <SectionTitle>Learn Directly from Vijay Narwani</SectionTitle>
        <SectionSub>Watch, Learn & Lead — Free Finance Education</SectionSub>

        <div className="mt-12 grid lg:grid-cols-3 gap-8 reveal">
          <div className="lg:col-span-2">
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-elegant bg-black">
              <iframe
                key={active.id}
                className="w-full h-full"
                src={embed(active.id)}
                title={active.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h3 className="mt-5 text-2xl font-display font-bold text-navy">{active.title}</h3>
            <p className="mt-2 text-muted-foreground">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-navy/5 text-navy text-xs font-semibold mr-2">{active.topic}</span>
              Watch the full lesson and take notes — designed for working professionals.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <h4 className="font-display text-lg font-bold text-navy flex items-center gap-2">
              <Plus className="h-5 w-5 text-gold" /> Add Video to Playlist
            </h4>
            <div className="mt-4 space-y-3">
              <Input placeholder="Paste YouTube Video URL" value={url} onChange={(e) => setUrl(e.target.value)} />
              <Input placeholder="Video Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATS.filter((c) => c !== "All").map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addVideo} variant="gold" className="w-full">Add to Playlist</Button>
            </div>
          </div>
        </div>

        <div className="mt-12 reveal">
          <Tabs value={cat} onValueChange={setCat}>
            <TabsList className="flex flex-wrap h-auto bg-navy/5 p-1.5">
              {CATS.map((c) => (
                <TabsTrigger key={c} value={c} className="data-[state=active]:bg-navy data-[state=active]:text-white">
                  {c}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={cat} className="mt-6">
              <h4 className="font-display text-xl font-bold text-navy mb-4">More Lessons</h4>
              <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
                {filtered.map((v) => (
                  <button
                    key={v.id + v.title}
                    onClick={() => { setActive(v); document.getElementById("videos")?.scrollIntoView({ behavior: "smooth" }); }}
                    className="snap-start text-left min-w-[280px] max-w-[280px] bg-white rounded-xl overflow-hidden border hover:shadow-elegant transition-all group"
                  >
                    <div className="relative aspect-video bg-navy/10">
                      <img src={thumb(v.id)} alt={v.title} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-navy/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-gold flex items-center justify-center">
                          <Play className="h-5 w-5 text-navy fill-current" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">{v.duration}</span>
                    </div>
                    <div className="p-4">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-gold/15 text-navy text-[10px] font-bold uppercase">{v.topic}</span>
                      <h5 className="mt-2 font-semibold text-navy line-clamp-2">{v.title}</h5>
                      <div className="mt-3 text-sm font-semibold text-gold inline-flex items-center gap-1">
                        Watch Now <Play className="h-3 w-3 fill-current" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

/* ---------------- section helpers ---------------- */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-bold uppercase tracking-[0.2em] text-gold text-center">{children}</div>;
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-display font-bold text-navy text-center max-w-3xl mx-auto leading-tight">{children}</h2>;
}
function SectionSub({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">{children}</p>;
}

/* ---------------- About ---------------- */
function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-14 items-start">
        <div className="reveal">
          <div className="relative rounded-3xl overflow-hidden border-4 border-gold shadow-elegant">
            <img src={portrait} alt="Vijay Narwani" className="w-full aspect-[4/5] object-cover" loading="lazy" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["CA-ICAI", "CPA", "ACMA/CGMA", "CISA", "ICAEW Finalist"].map((c) => (
              <span key={c} className="px-3 py-1.5 rounded-full bg-navy text-white text-xs font-semibold">{c}</span>
            ))}
          </div>
        </div>
        <div className="reveal">
          <SectionLabel>About the Educator</SectionLabel>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-bold text-navy leading-tight">
            Global Finance Strategist • Leadership Mentor • Corporate Finance Advisor
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Vijay Narwani brings over 26 years of leadership experience across corporate finance, strategic planning, financial transformation and global business environments across India and the GCC.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            With a learner-first and industry-driven approach, he helps professionals move beyond exam preparation by building practical finance judgment, leadership mindset and global career readiness.
          </p>
          <div className="mt-8 space-y-3">
            {[
              ["📌", "26+ Years of Finance Leadership Experience"],
              ["🌐", "Experience Across India & GCC Markets"],
              ["🎯", "6,000+ Professionals Mentored"],
            ].map(([i, t]) => (
              <div key={t} className="flex items-start gap-3 p-4 rounded-xl bg-background border">
                <span className="text-xl">{i}</span>
                <span className="text-navy font-medium">{t}</span>
              </div>
            ))}
          </div>
          <blockquote className="mt-8 border-l-4 border-gold pl-5 italic text-lg text-navy font-display">
            "From certification to leadership, the goal is not only to qualify — but to lead with confidence."
          </blockquote>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Certifications ---------------- */
const US_CERTS = [
  ["CPA", "Certified Public Accountant"],
  ["EA", "Enrolled Agent"],
  ["CMA", "Certified Management Accountant"],
  ["CIA", "Certified Internal Auditor"],
  ["CFA", "Chartered Financial Analyst"],
  ["US GAAP", "Generally Accepted Accounting Principles"],
  ["US Taxation"],
  ["Corporate Finance"],
  ["Financial Reporting & Analysis"]

];
const UK_CERTS = [
  ["CIMA", "Chartered Institute of Management Accountants"],
  ["ACCA", "Association of Chartered Certified Accountants"],
  ["ICAEW", "Institute of Chartered Accountants in England and Wales"],
  ["IFRS / IAS", "International Financial Reporting Standards"],
  ["DipIFR"],
  ["UK Taxation"],
  ["Strategic Business Leadership "],
  ["Audit & Assurance"],

];

function CertCard({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="group bg-white rounded-xl p-6 border-l-4 border-navy hover:border-gold shadow-sm hover:shadow-elegant transition-all">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="h-5 w-5 text-gold mt-0.5 shrink-0" />
        <div>
          <h4 className="font-display text-lg font-bold text-navy">{name}</h4>
          <p className="text-sm text-muted-foreground mt-1">{desc}</p>
          <a href="#contact" className="mt-3 inline-flex items-center text-sm font-semibold text-gold group-hover:translate-x-1 transition-transform">
            Learn More <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

function Expertise() {
  return (
    <section id="expertise" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionLabel>Expertise</SectionLabel>
        <SectionTitle>Global Finance Certifications & Learning Tracks</SectionTitle>
        <div className="mt-12 max-w-5xl mx-auto reveal">
          <Tabs defaultValue="us">
            <TabsList className="grid grid-cols-2 max-w-md mx-auto h-12 bg-white border">
              <TabsTrigger value="us" className="data-[state=active]:bg-navy data-[state=active]:text-white h-full">🇺🇸 U.S. Curriculum</TabsTrigger>
              <TabsTrigger value="uk" className="data-[state=active]:bg-navy data-[state=active]:text-white h-full">🇬🇧 UK & International</TabsTrigger>
            </TabsList>
            <TabsContent value="us" className="mt-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {US_CERTS.map(([n, d]) => <CertCard key={n} name={n} desc={d} />)}
              </div>
            </TabsContent>
            <TabsContent value="uk" className="mt-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {UK_CERTS.map(([n, d]) => <CertCard key={n} name={n} desc={d} />)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Quiz ---------------- */
const QUIZ_Q = [
  { q: "Where do you plan to build your career?", opts: ["India", "Middle East", "US", "UK", "Other"] },
  {
    q: "Your career goal?", opts: ["Career Growth & Promotions",
      "Global Finance Career ",
      "Leadership & Management",
      "Career Transition into Finance",
      "Entrepreneurship",
      // "Job/Promotion", "Entrepreneurship", "Teaching", "Switch to Finance"
    ]
  },
  {
    q: "Your experience level?", opts: [
      "Student / Fresher",
      "Early Career (1–5 Years)",
      "Mid-Level Professional",
      "Senior Finance Professional"

      // "Student", "1–5 yrs", "5+ yrs"
    ]
  },
];
function recommend(answers: string[]) {
  const [region, , exp] = answers;
  if (region === "US") return { cert: "CPA", why: "Best fit for US public accounting & global mobility." };
  if (region === "UK") return { cert: "ACCA", why: "Globally recognized UK qualification with broad career paths." };
  if (region === "Middle East") return { cert: "CMA", why: "Highly valued in the Middle East for finance leadership roles." };
  if (exp === "5+ yrs") return { cert: "CFA", why: "Strategic credential for investment & senior finance professionals." };
  return { cert: "ACCA", why: "Flexible, globally portable certification ideal for early-career professionals." };
}
function Quiz() {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState<string[]>([]);
  const done = step >= QUIZ_Q.length;
  const result = done ? recommend(ans) : null;
  const pick = (o: string) => {
    setAns((a) => [...a, o]);
    setStep((s) => s + 1);
  };
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionLabel>Interactive</SectionLabel>
        <SectionTitle>Which Finance Certification Is Right for You?</SectionTitle>
        <div className="mt-10 bg-background border rounded-2xl p-8 shadow-sm reveal">
          {!done ? (
            <>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold font-bold">
                Question {step + 1} of {QUIZ_Q.length}
              </div>
              <h3 className="mt-3 text-2xl font-display font-bold text-navy">{QUIZ_Q[step].q}</h3>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {QUIZ_Q[step].opts.map((o) => (
                  <button
                    key={o}
                    onClick={() => pick(o)}
                    className="text-left p-4 rounded-xl bg-white border-2 border-transparent hover:border-gold hover:shadow-elegant transition-all font-medium text-navy"
                  >
                    {o}
                  </button>
                ))}
              </div>
              <div className="mt-6 h-1.5 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-gradient-gold transition-all" style={{ width: `${(step / QUIZ_Q.length) * 100}%` }} />
              </div>
            </>
          ) : (
            <div className="text-center">
              <Trophy className="h-12 w-12 text-gold mx-auto" />
              <p className="mt-4 uppercase text-xs font-bold tracking-widest text-gold">Recommended Pathway</p>
              <h3 className="mt-2 text-4xl font-display font-bold text-navy">{result!.cert}</h3>
              <p className="mt-3 text-muted-foreground max-w-md mx-auto">{result!.why}</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button asChild variant="gold" size="lg">
                  <a href="#contact">Enquire About This Program <ArrowRight className="ml-1 h-4 w-4" /></a>
                </Button>
                <Button variant="outline" size="lg" onClick={() => { setStep(0); setAns([]); }}>Retake Quiz</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Specializations ---------------- */
const SPECS = [
  { i: BarChart3, t: "Financial Modeling & Valuation", d: "Advanced financial modeling, business valuation and strategic finance techniques used in global corporate environments." },
  { i: Target, t: "Strategic Planning & Business Finance", d: "Budgeting, forecasting, performance analysis and strategic planning for modern finance leadership roles." },
  { i: ShieldAlert, t: "Risk Management & IFRS Compliance", d: "Practical understanding of IFRS, governance, internal controls and enterprise risk frameworks." },
  { i: Bot, t: "AI-Driven FP&A & Finance Automation", d: "Future-ready finance capabilities integrating AI tools, automation and digital finance workflows." },
];
function Specializations() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionLabel>Specializations</SectionLabel>
        <SectionTitle>Areas of Specialization & Impact</SectionTitle>
        <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto reveal">
          {SPECS.map(({ i: Icon, t, d }) => (
            <div key={t} className="bg-white p-7 rounded-2xl border hover:shadow-elegant transition-all">
              <div className="h-12 w-12 rounded-xl bg-gradient-gold flex items-center justify-center">
                <Icon className="h-6 w-6 text-navy" />
              </div>
              <h3 className="mt-5 text-xl font-display font-bold text-navy">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Programs ---------------- */
const PROGRAMS = [
  { i: BarChart3, t: "Financial Modeling & Business Valuation", d: "DCF, comps, M&A modeling — built for finance pros." },
  { i: Target, t: "Strategic FP&A & Business Finance", d: "Budgeting, forecasting & variance frameworks." },
  { i: Briefcase, t: "Finance for Non-Finance Managers", d: "Demystify finance for leaders across functions." },
  { i: BookOpen, t: "Financial Statement Analysis & Interpretation", d: "Ratios, signals & decision-making toolkit." },
  { i: Compass, t: "Budgeting, Forecasting & Variance Analysis", d: "Drive accountability with structured cycles." },
  { i: ShieldAlert, t: "Investment Analysis & Risk Management", d: "Portfolio theory, risk metrics & strategy." },
  { i: BarChart3, t: "Working Capital & Cash Flow Management", d: "Optimize liquidity for sustainable growth." },
  { i: Sparkles, t: "Custom/Tailor-Made Programs", d: "Designed for your team's exact needs." },
];
function Programs() {
  return (
    <section id="programs" className="py-24 bg-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 globe-pattern opacity-50" />
      <div className="container mx-auto px-4 relative">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-gold text-center">Programs Offered</div>
        <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-display font-bold text-center max-w-3xl mx-auto leading-tight">
          Executive Programs in Finance & Leadership
        </h2>
        <div className="mt-12 flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 snap-x reveal">
          {PROGRAMS.map(({ i: Icon, t, d }) => (
            <div key={t} className="snap-start min-w-[300px] max-w-[300px] bg-gradient-card rounded-2xl p-7 border border-white/10 hover:border-gold/50 transition-all shadow-elegant">
              <div className="h-12 w-12 rounded-xl bg-gold/20 flex items-center justify-center">
                <Icon className="h-6 w-6 text-gold" />
              </div>
              <h3 className="mt-5 text-lg font-display font-bold leading-snug">{t}</h3>
              <p className="mt-2 text-sm text-white/75">{d}</p>
              <a href="#contact" className="mt-5 inline-flex items-center text-sm font-semibold text-gold">
                Explore Program <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Teaching ---------------- */
const TEACH = [
  { i: "🌍", t: "Globally Aligned Learning Pathways", d: "Structured programs aligned with US, UK, Middle East and global finance markets." },
  { i: "📋", t: "Practical, Industry-Focused Learning", d: "Real-world case studies, financial modeling and executive-level applications." },
  { i: "🎯", t: "Leadership & Career Transformation", d: "Preparing professionals for leadership roles — not just exam success." },
  { i: "🚀", t: "Future-Ready Finance", d: "AI, automation, FP&A and modern finance tools for the next generation of finance professionals." },
];
function Teaching() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionLabel>Approach</SectionLabel>
        <SectionTitle>Beyond Certifications — Building Global Finance Leaders</SectionTitle>
        <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto reveal">
          {TEACH.map((b) => (
            <div key={b.t} className="bg-white p-7 rounded-2xl border">
              <div className="text-3xl">{b.i}</div>
              <h3 className="mt-3 text-lg font-display font-bold text-navy">{b.t}</h3>
              <p className="mt-2 text-muted-foreground text-sm">{b.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 bg-gradient-navy rounded-3xl p-10 md:p-14 text-center reveal">
          <Quote className="h-10 w-10 text-gold mx-auto" />
          <p className="mt-4 text-2xl md:text-3xl font-display font-semibold text-gold leading-snug">
            "Empowering learners to lead in boardrooms — not just clear exams."
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Learning Path Timeline ---------------- */
const STEPS = [
  { n: 1, t: "Choose Certification", i: Compass },
  { n: 2, t: "Join MMI’s Mentorship Program", i: GraduationCap },
  { n: 3, t: "Learn with Real Case Studies", i: BookOpen },
  { n: 4, t: "Clear Exam with Confidence", i: Trophy },
  { n: 5, t: "Land Your Global Finance Role", i: Building2 },
];
function Path() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <SectionLabel>Your Journey</SectionLabel>
        <SectionTitle>The Learning Path to Finance Leadership</SectionTitle>
        <div className="mt-14 max-w-6xl mx-auto reveal">
          <div className="relative">
            <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-gold" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {STEPS.map(({ n, t, i: Icon }) => (
                <div key={n} className="text-center relative">
                  <div className="mx-auto w-16 h-16 rounded-full bg-navy text-gold flex items-center justify-center border-4 border-gold relative z-10 shadow-elegant">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="mt-3 text-xs font-bold uppercase tracking-widest text-gold">Step {n}</div>
                  <div className="mt-1 text-sm font-semibold text-navy">{t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Global Reach ---------------- */
const REACH = [
  { region: "India",       count: "500+", coords: [78.9629,  20.5937] as [number, number] },
  { region: "GCC", count: "200+", coords: [54.3773,  24.4539] as [number, number] },
  { region: "UK",          count: "120+", coords: [-1.1743,  52.3555] as [number, number] },
  { region: "USA",         count: "180+", coords: [-95.7129, 37.0902] as [number, number] },
];
function GlobalReach() {
  return (
    <section className="py-24 bg-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 globe-pattern" />
      <div className="container mx-auto px-4 relative">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-gold text-center">Global Reach</div>
        <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-display font-bold text-center max-w-3xl mx-auto leading-tight">
          Mentoring Finance Professionals Across Global Markets
        </h2>
        <div className="mt-8 max-w-5xl mx-auto reveal">
          <div className="relative rounded-2xl border border-white/10 bg-navy-deep/60 overflow-hidden aspect-[16/9]">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 200, center: [30, 25] }}
              style={{ width: "125%", height: "125%", position: "absolute", inset: 0 }}
            >
              <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: { fill: "rgba(255,255,255,0.08)", stroke: "rgba(255,255,255,0.15)", strokeWidth: 0.5, outline: "none" },
                        hover:   { fill: "rgba(201,168,76,0.25)", stroke: "rgba(201,168,76,0.5)", strokeWidth: 0.5, outline: "none" },
                        pressed: { fill: "rgba(201,168,76,0.35)", outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>
              {REACH.map((r) => (
                <Marker key={r.region} coordinates={r.coords}>
                  {/* Three staggered expanding rings for a spreading glow effect */}
                  <circle r={8}  fill="#C9A84C" opacity={0}>
                    <animate attributeName="r"       from="6"   to="28"  dur="2.4s" begin="0s"    repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.6" to="0"   dur="2.4s" begin="0s"    repeatCount="indefinite" />
                  </circle>
                  <circle r={8}  fill="#C9A84C" opacity={0}>
                    <animate attributeName="r"       from="6"   to="22"  dur="2.4s" begin="0.8s"  repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0"   dur="2.4s" begin="0.8s"  repeatCount="indefinite" />
                  </circle>
                  <circle r={8}  fill="#C9A84C" opacity={0}>
                    <animate attributeName="r"       from="6"   to="16"  dur="2.4s" begin="1.6s"  repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4" to="0"   dur="2.4s" begin="1.6s"  repeatCount="indefinite" />
                  </circle>
                  {/* Solid dot on top */}
                  <circle r={6} fill="#C9A84C" stroke="white" strokeWidth={1.5} />
                  {/* Label */}
                  <rect x={-38} y={10} width={76} height={20} rx={4} fill="#1B3A6B" opacity={0.92} />
                  <text x={0} y={24} textAnchor="middle" fontSize={8} fontWeight="700" fill="#C9A84C">
                    {r.count} · {r.region}
                  </text>
                </Marker>
              ))}
            </ComposableMap>
          </div>
          {/* Legend */}
          {/* <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {REACH.map((r) => (
              <div key={r.region} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-gold shrink-0" />
                <div>
                  <div className="text-xs text-white/60">{r.region}</div>
                  <div className="text-sm font-bold text-gold">{r.count}</div>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Comparison Table ---------------- */
const COMPARE = [
  ["Duration", "18 months", "6–12 months", "3–4 years", "4–5 years"],
  ["Difficulty", "High", "Moderate–High", "High", "Very High"],
  ["Cost", "$$$", "$$", "$$", "$"],
  ["Career Outcome", "Public Acct / CFO", "Mgmt Accounting", "Global Finance", "Statutory / Audit"],
  ["Region", "US (Global)", "US (Global)", "UK (Global)", "India"],
  ["Best For", "Audit, Advisory, CFO Roles", "FP&A, Business Finance", "International Accounting Careers", "Indian Statutory & Tax Practice"]
];
function Comparison() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionLabel>Compare</SectionLabel>
        <SectionTitle>CPA vs CMA vs ACCA vs CA — Which Is Right for You?</SectionTitle>
        <div className="mt-12 max-w-5xl mx-auto overflow-x-auto reveal">
          <table className="w-full bg-white rounded-2xl overflow-hidden shadow-elegant border">
            <thead>
              <tr className="bg-navy text-white">
                <th className="text-left p-4 font-display font-semibold">Criteria</th>
                {["CPA", "CMA", "ACCA", "CA"].map((c) => (
                  <th key={c} className="text-left p-4 font-display font-semibold text-gold">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row, idx) => (
                <tr key={row[0]} className={idx % 2 ? "bg-background" : ""}>
                  {row.map((cell, j) => (
                    <td key={j} className={`p-4 text-sm ${j === 0 ? "font-semibold text-navy" : "text-muted-foreground"}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Achievements ---------------- */
function Achievements() {
  const items = [
    "Mentored 6,000+ professionals across India & globally",
    "Guided learners to earn: CPA, CA, CMA, CFA, CISA",
    "Built critical thinking, strategic finance & leadership",
    "Recognized for shaping CFO-ready talent",
    "Expert content creator for CPA, CMA, ACCA, CFA, CISA",
    "Developed MCQs, case studies & structured curriculum",
  ];
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div className="reveal">
          <SectionLabel>Impact</SectionLabel>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-bold text-navy leading-tight">
            Empowering Future Finance Leaders
          </h2>
          <ul className="mt-8 space-y-3">
            {items.map((t) => (
              <li key={t} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-gold mt-0.5 shrink-0" />
                <span className="text-navy">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-3 gap-3 reveal">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`rounded-2xl bg-gradient-card ${i % 2 ? "aspect-square" : "aspect-[3/4]"} relative overflow-hidden border border-gold/20`}>
              <div className="absolute inset-0 globe-pattern opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <GraduationCap className="h-10 w-10 text-gold/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 mt-16">
        <div className="bg-gradient-navy rounded-3xl p-10 text-center reveal">
          <p className="text-2xl md:text-3xl font-display font-semibold text-gold">
            "Beyond certifications — building global finance leadership."
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Credentials ---------------- */
function Credentials() {
  const left = [
    ["🎓", "ICAEW Finalist"],
    ["📘", "CA – ICAI"],
    ["📊", "ACMA, CGMA – Global Management Accounting"],
    ["📈", "CPA"],
    ["🔐", "CISA – Information Systems Auditor"],
    ["📚", "Investment Analysis & Portfolio Management (CFA Curriculum – Self-Directed)"],
  ];
  const right = [
    ["📌", "26+ years in CFO & Finance Director roles"],
    ["🌐", "Experience across India, GCC and global markets"],
    ["👥", "Mentored 6,000+ professionals"],
    ["🧩", "Expertise in IFRS, FP&A, Risk, Valuation & Financial Modeling "],
    ["🎯", "Preparing professionals for modern CFO and finance leadership roles"],
  ];
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionLabel>Background</SectionLabel>
        <SectionTitle>Educational Background & Credentials</SectionTitle>
        <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto reveal">
          <div className="bg-white rounded-2xl p-8 border">
            <h3 className="font-display text-xl font-bold text-navy flex items-center gap-2">
              <Award className="h-5 w-5 text-gold" /> Credentials
            </h3>
            <ul className="mt-6 space-y-3">
              {left.map(([i, t]) => (
                <li key={t} className="flex gap-3 items-start"><span className="text-xl">{i}</span><span className="text-navy">{t}</span></li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-8 border">
            <h3 className="font-display text-xl font-bold text-navy flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-gold" /> Professional Highlights
            </h3>
            <ul className="mt-6 space-y-3">
              {right.map(([i, t]) => (
                <li key={t} className="flex gap-3 items-start"><span className="text-xl">{i}</span><span className="text-navy">{t}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Content Development ---------------- */
function ContentDev() {
  const items = [
    {
      title: "Academic Learning Frameworks",
      desc: "Designed academic and professional learning frameworks for US, UK and Indian finance qualification pathways.",
    },
    {
      title: "MCQs, TBSs, Case Studies & Curriculum",
      desc: "Developed MCQs, TBSs, case studies, structured curriculum and training content across CPA, CMA, CFA, ACCA, CA, EA, CISA, CS and CIA-related finance, audit, taxation and risk domains.",
    },
    {
      title: "Tailor-Made Finance Courses",
      desc: "Designed customized finance courses for professionals, corporates and learners across financial reporting, FP&A, valuation, modelling, taxation, audit and leadership areas.",
    },
    {
      title: "Business & Compliance Alignment",
      desc: "Integrates academic finance learning with real-world business strategy, global compliance practices and practical corporate finance application.",
    },
  ];
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <SectionLabel>Curriculum</SectionLabel>
        <SectionTitle>Content Development & Academic Expertise</SectionTitle>
        <div className="mt-12 grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto reveal">
          {items.map((item) => (
            <div key={item.title} className="bg-white p-6 rounded-2xl border flex flex-col gap-3 hover:shadow-elegant transition-shadow">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-gold/15 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-gold" />
                </div>
                <h4 className="font-display font-bold text-navy text-lg leading-snug">{item.title}</h4>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed pl-11">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-xl font-display italic text-navy max-w-3xl mx-auto reveal">
          "I don't just teach finance — I help build the content that shapes finance education."
        </p>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */
const TESTI = [
  {
    q: "Vijay sir simplified IFRS and advanced accounting concepts in a way I had never experienced before. The practical case studies and structured guidance helped me clear ACCA with much greater confidence.",
    a: "Rohan M.", r: "Finance Manager | Dubai",
  },
  {
    q: "The FP&A and Financial Modelling sessions gave me practical exposure far beyond theory. Within a year, I was able to transition into a Finance Controller role with significantly stronger analytical confidence.",
    a: "Priya S.", r: "Finance Controller | Mumbai",
  },
  {
    q: "Coming from a non-US accounting background, I initially struggled with US GAAP and CPA concepts. Vijay’s structured teaching approach and industry examples made the learning process practical and manageable.",
    a: "Ahmed K.", r: "CPA Professional | Qatar",
  },
];
function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <SectionLabel>Testimonials</SectionLabel>
        <SectionTitle>What Professionals Say</SectionTitle>
        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto reveal">
          {TESTI.map((t) => (
            <div key={t.a} className="bg-background p-7 rounded-2xl border hover:shadow-elegant transition-all">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <Quote className="mt-4 h-7 w-7 text-gold/40" />
              <p className="mt-3 text-navy leading-relaxed">{t.q}</p>
              <div className="mt-6 pt-4 border-t">
                <div className="font-display font-bold text-navy">{t.a}</div>
                <div className="text-sm text-muted-foreground">{t.r}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Video Testimonials ---------------- */
function VideoTesti() {
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null]);
  const [draft, setDraft] = useState<string[]>(["", "", ""]);
  const set = (i: number, v: string) => setDraft((d) => d.map((x, j) => (j === i ? v : x)));
  const add = (i: number) => {
    const id = getYouTubeId(draft[i]);
    if (!id) return toast.error("Paste a valid YouTube URL");
    setSlots((s) => s.map((x, j) => (j === i ? id : x)));
    toast.success("Video testimonial added");
  };
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionLabel>Hear From Students</SectionLabel>
        <SectionTitle>Video Testimonials</SectionTitle>
        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto reveal">
          {slots.map((id, i) => (
            <div key={i} className="bg-white rounded-2xl border overflow-hidden">
              <div className="aspect-video bg-navy/10">
                {id ? (
                  <iframe className="w-full h-full" src={embed(id)} title={`Testimonial ${i + 1}`} allowFullScreen />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <Play className="h-8 w-8" />
                    <span className="text-sm">No video yet</span>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <Input placeholder="Paste YouTube URL" value={draft[i]} onChange={(e) => set(i, e.target.value)} />
                <Button onClick={() => add(i)} variant="outline" className="w-full">Add Testimonial</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Lead Magnet ---------------- */
function LeadMagnet() {
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Email required");
    toast.success("✅ Check your inbox — guide is on the way!");
    setName(""); setEmail("");
  };
  return (
    <section className="py-20 bg-gradient-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 globe-pattern" />
      <div className="container mx-auto px-4 relative grid lg:grid-cols-2 gap-10 items-center">
        <div className="reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold border border-gold/30">
            <Download className="h-3 w-3" /> Free Resource
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-display font-bold leading-tight">
            Download Your Free <span className="text-gold">Finance Career Roadmap</span>
          </h2>
          <p className="mt-4 text-white/80">
            A practical guide to navigating CPA, CMA, ACCA, CFA, IFRS and global finance career pathways.
          </p>
          <p className="mt-4 text-sm text-white/60">Trusted by 10,000+ professionals globally.</p>
        </div>
        <form onSubmit={submit} className="bg-white text-navy p-7 rounded-2xl shadow-elegant reveal space-y-4">
          <div>
            <Label htmlFor="lm-name">Your Name</Label>
            <Input id="lm-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="lm-email">Email Address</Label>
            <Input id="lm-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
          </div>
          <Button type="submit" variant="gold" className="w-full" size="lg">
            <Download className="mr-2 h-4 w-4" /> Download the Career Roadmap
          </Button>
        </form>
      </div>
    </section>
  );
}

/* ---------------- Mission ---------------- */
function Mission() {
  return (
    <section className="py-24 bg-navy-deep text-white relative overflow-hidden">
      <div className="absolute inset-0 globe-pattern" />
      <div className="container mx-auto px-4 text-center relative max-w-4xl">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Vision</div>
        <h2 className="mt-3 text-4xl md:text-5xl font-display font-bold leading-tight">The Mission Continues</h2>
        <p className="mt-6 text-white/80 text-lg">
          With 10,000+ learners and professionals guided globally, the mission is to build practical, technology-driven finance learning platforms that prepare future-ready finance leaders.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["🎯 Strategic FP&A & Financial Modelling ", "🛡️ Enterprise Risk & Compliance", "💡 AI-Driven Finance Transformation", " 🌎 IFRS & Global Reporting"].map((c) => (
            <span key={c} className="px-4 py-2 rounded-full bg-white/5 border border-gold/30 text-sm">{c}</span>
          ))}
        </div>
        <p className="mt-12 text-2xl md:text-3xl font-display font-semibold text-gold leading-snug">
          "The goal isn’t merely to clear exams — it is to develop future CFOs, Controllers, finance strategists, and global business leaders."
        </p>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", program: "", message: "" });
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [loading, setLoading] = useState(false);
  const submit = useServerFn(submitContact);

  const validate = () => {
    const e: { email?: string; phone?: string } = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Invalid email address";
    if (form.phone && !form.phone.match(/^\d{10}$/)) e.phone = "Phone must be 10 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return toast.error("Please fill name & email");
    if (!validate()) return;
    setLoading(true);
    try {
      await submit({ data: form });
      toast.success("✅ Thank you! Vijay will respond within 24 hours.");
      setForm({ name: "", email: "", phone: "", program: "", message: "" });
      setErrors({});
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <SectionLabel>Contact</SectionLabel>
        <SectionTitle>Let's Shape the Future of Finance Together</SectionTitle>
        <div className="mt-14 grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-background p-8 rounded-2xl border reveal space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label htmlFor="c-name">Full Name</Label><Input id="c-name" className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label htmlFor="c-email">Email</Label><Input id="c-email" type="email" className={`mt-1.5 ${errors.email ? "border-red-500" : ""}`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />{errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}</div>
            </div>
            <div><Label htmlFor="c-phone">Phone</Label><Input id="c-phone" className={`mt-1.5 ${errors.phone ? "border-red-500" : ""}`} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />{errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}</div>
            <div>
              <Label>Interested Program</Label>
              <Select value={form.program} onValueChange={(v) => setForm({ ...form, program: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select a program" /></SelectTrigger>
                <SelectContent>
                  {["CPA", "CMA", "ACCA", "CFA", "IFRS", "Financial Modeling", "FP&A", "Other"].map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div><Label htmlFor="c-msg">Message</Label><Textarea id="c-msg" rows={4} className="mt-1.5" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
              {loading ? "Sending…" : <>Send Message <ArrowRight className="ml-1 h-4 w-4" /></>}
            </Button>
          </form>

          <div className="reveal">
            <h3 className="font-display text-2xl font-bold text-navy">Contact Details</h3>
            <p className="mt-2 text-muted-foreground">Reach out — typically responds within 24 hours.</p>
            <div className="mt-6 space-y-4">
              <a href="mailto:vijayknarwani@yahoo.com" className="flex items-center gap-4 p-4 bg-background rounded-xl border hover:border-gold transition-colors">
                <div className="h-11 w-11 rounded-lg bg-gold/15 text-gold flex items-center justify-center"><Mail className="h-5 w-5" /></div>
                <div><div className="text-xs text-muted-foreground uppercase tracking-wider">Email</div><div className="font-semibold text-navy">vijayknarwani@yahoo.com</div></div>
              </a>
              <a href="tel:+917048456589" className="flex items-center gap-4 p-4 bg-background rounded-xl border hover:border-gold transition-colors">
                <div className="h-11 w-11 rounded-lg bg-gold/15 text-gold flex items-center justify-center"><Phone className="h-5 w-5" /></div>
                <div><div className="text-xs text-muted-foreground uppercase tracking-wider">India</div><div className="font-semibold text-navy">+91 70484 56589</div></div>
              </a>
              <a href="tel:+97466031216" className="flex items-center gap-4 p-4 bg-background rounded-xl border hover:border-gold transition-colors">
                <div className="h-11 w-11 rounded-lg bg-gold/15 text-gold flex items-center justify-center"><Phone className="h-5 w-5" /></div>
                <div><div className="text-xs text-muted-foreground uppercase tracking-wider">Qatar</div><div className="font-semibold text-navy">+974 6603 1216</div></div>
              </a>
              <a href="https://linkedin.com/in/ca-vijay-narwani-fca-acmacgma-cpa-cisa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-background rounded-xl border hover:border-gold transition-colors">
                <div className="h-11 w-11 rounded-lg bg-gold/15 text-gold flex items-center justify-center"><Linkedin className="h-5 w-5" /></div>
                <div><div className="text-xs text-muted-foreground uppercase tracking-wider">LinkedIn</div><div className="font-semibold text-navy">Vijay Narwani</div></div>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-background rounded-xl border hover:border-gold transition-colors">
                <div className="h-11 w-11 rounded-lg bg-gold/15 text-gold flex items-center justify-center"><Instagram className="h-5 w-5" /></div>
                <div><div className="text-xs text-muted-foreground uppercase tracking-wider">Instagram</div><div className="font-semibold text-navy">@mmieducator</div></div>
              </a>
            </div>
            <blockquote className="mt-8 border-l-4 border-gold pl-5 italic text-lg text-navy font-display">
              "Let's shape the future of finance together."
            </blockquote>
            <div className="mt-6 flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="h-4 w-4" /> India • GCC • Global Finance Learning
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="bg-navy-deep text-white pt-16 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 globe-pattern opacity-50" />
      <div className="container mx-auto px-4 relative">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <img src={logo} alt="MMI Educator" className="h-12 w-12 rounded-lg" width={48} height={48} />
              <div>
                <div className="font-display text-xl font-bold">MMI Educator</div>
                <div className="text-xs text-gold">Vijay Narwani</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-white/70">Empowering Global Leaders in Finance & Business.</p>
          </div>
          <div>
            <h4 className="font-display font-bold text-gold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/75">
              {[["About", "#about"], ["Expertise", "#expertise"], ["Video Lessons", "#videos"], ["Testimonials", "#testimonials"], ["Contact", "#contact"]].map(([l, h]) => (
                <li key={h}><a href={h} className="hover:text-gold transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-gold mb-4">Programs</h4>
            <ul className="space-y-2 text-sm text-white/75">
              {["CPA Prep", "CMA Prep", "ACCA Prep", "Financial Modeling", "FP&A with AI", "Custom Corporate"].map((p) => (
                <li key={p}><a href="#programs" className="hover:text-gold transition-colors">{p}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-gold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/75">
              <li><a href="mailto:vijayknarwani@yahoo.com" className="hover:text-gold">vijayknarwani@yahoo.com</a></li>
              <li><a href="tel:+917048456589" className="hover:text-gold">+91 70484 56589</a></li>
              <li><a href="tel:+97466031216" className="hover:text-gold">+974 6603 1216</a></li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"><Linkedin className="h-4 w-4" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"><Instagram className="h-4 w-4" /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 text-center text-sm text-white/60">
          © 2026 Vijay Narwani | MMI Educator. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

/* ---------------- floating ---------------- */
function Floating() {
  return (
    <>
      <a
        href="https://linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="fixed bottom-6 left-6 z-40 h-12 w-12 rounded-full bg-navy text-white flex items-center justify-center shadow-elegant hover:bg-navy-deep transition-colors"
      >
        <Linkedin className="h-5 w-5" />
      </a>
      <a
        href="#contact"
        className="fixed bottom-6 right-25 z-40 px-5 py-3 rounded-full bg-gradient-gold text-navy font-semibold shadow-gold pulse-gold flex items-center gap-2 hover:scale-[1.03] transition-transform"
      >
        <Sparkles className="h-4 w-4" /> Schedule a Mentorship Call
      </a>
    </>
  );
}

/* ---------------- root ---------------- */
function Index() {
  useReveal();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <WebinarBanner />
      <Navbar />
      <Hero />
      <Stats />
      <CorporateExperience />
      <About />
      <Expertise />
      <Quiz />
      <Specializations />
      <Programs />
      <Path />
      <VideoHub />
      <Teaching />
      <GlobalReach />
      <Comparison />
      <Achievements />
      <Credentials />
      <ContentDev />
      <Testimonials />
      <VideoTesti />
      <LeadMagnet />
      <Mission />
      <Contact />
      <Footer />
      <Floating />
      <Toaster richColors position="top-center" />
    </div>
  );
}
