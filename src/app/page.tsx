"use client";
import { useEffect, useState } from "react";
import { tutorsApi, Tutor } from "@/lib/api";
import { TutorCard } from "@/components/TutorCard";
import Link from "next/link";

export default function HomePage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tutorsApi.getAll().then((r) => setTutors(r.data)).finally(() => setLoading(false));
  }, []);

  const featured = tutors
    .filter((t) => t.tutorProfile)
    .slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">✨ #1 Tutoring Platform</div>
            <h1>
              Learn Anything from<br />
              <span>Expert Tutors</span>
            </h1>
            <p className="hero-sub">
              Connect with verified tutors across hundreds of subjects.
              Book sessions instantly and start learning today.
            </p>

            <div className="search-bar">
              <span style={{ paddingLeft:"0.5rem" }}>🔍</span>
              <input
                type="text"
                placeholder="Search tutors by subject, name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Link
                href={`/tutors${search ? `?q=${encodeURIComponent(search)}` : ""}`}
                className="btn btn-primary btn-sm"
              >
                Search
              </Link>
            </div>

            <div className="hero-actions">
              <Link href="/tutors" className="btn btn-primary btn-lg">Browse Tutors</Link>
              <Link href="/register" className="btn btn-outline btn-lg">Become a Tutor</Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{tutors.length}+</span>
                <div className="stat-label">Expert Tutors</div>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <div className="stat-label">Sessions Booked</div>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <div className="stat-label">Subjects Covered</div>
              </div>
              <div className="stat-item">
                <span className="stat-number">4.9★</span>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="section" style={{ background:"var(--bg-card)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
        <div className="container">
          <div className="section-header">
            <h2>How SkillBridge Works</h2>
            <p>Start learning in three simple steps</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px,1fr))", gap:"2rem" }}>
            {[
              { step:"01", icon:"🔍", title:"Find Your Tutor", desc:"Browse hundreds of expert tutors by subject, price, or rating." },
              { step:"02", icon:"📅", title:"Book a Session", desc:"Pick a time slot that works for you and book instantly." },
              { step:"03", icon:"🚀", title:"Start Learning", desc:"Connect with your tutor and achieve your learning goals." },
            ].map((item) => (
              <div key={item.step} className="card" style={{ textAlign:"center", padding:"2rem" }}>
                <div style={{ fontSize:"0.75rem", fontWeight:800, color:"var(--brand-400)", letterSpacing:"2px", marginBottom:"0.75rem" }}>
                  STEP {item.step}
                </div>
                <div style={{ fontSize:"2.5rem", marginBottom:"1rem" }}>{item.icon}</div>
                <h3 style={{ fontWeight:700, marginBottom:"0.5rem" }}>{item.title}</h3>
                <p style={{ color:"var(--text-muted)", fontSize:"0.9rem" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Tutors</h2>
            <p>Handpicked experts ready to help you succeed</p>
          </div>
          {loading ? (
            <div style={{ textAlign:"center", padding:"3rem" }}>
              <div className="spinner" />
            </div>
          ) : featured.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎓</div>
              <h3>No tutors yet</h3>
              <p>Be the first to join SkillBridge as a tutor!</p>
              <Link href="/register" className="btn btn-primary">Become a Tutor</Link>
            </div>
          ) : (
            <div className="tutor-grid">
              {featured.map((t) => <TutorCard key={t.id} tutor={t} />)}
            </div>
          )}
          {featured.length > 0 && (
            <div style={{ textAlign:"center", marginTop:"2.5rem" }}>
              <Link href="/tutors" className="btn btn-outline btn-lg">View All Tutors →</Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background:"linear-gradient(135deg, rgba(99,102,241,0.15), rgba(236,72,153,0.08))", borderTop:"1px solid var(--border)" }}>
        <div className="container" style={{ textAlign:"center" }}>
          <h2 style={{ fontSize:"clamp(1.75rem,4vw,2.5rem)", fontWeight:800, marginBottom:"1rem" }}>
            Ready to Start Learning?
          </h2>
          <p style={{ color:"var(--text-muted)", marginBottom:"2rem", fontSize:"1.05rem" }}>
            Join thousands of students who are already learning with SkillBridge.
          </p>
          <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link href="/tutors"   className="btn btn-outline btn-lg">Browse Tutors</Link>
          </div>
        </div>
      </section>
    </>
  );
}
