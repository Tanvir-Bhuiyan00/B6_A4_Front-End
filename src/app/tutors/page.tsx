"use client";
import { useEffect, useState, useCallback } from "react";
import { tutorsApi, categoriesApi, Tutor, Category } from "@/lib/api";
import { TutorCard } from "@/components/TutorCard";
import { useSearchParams } from "next/navigation";

export default function TutorsPage() {
  const searchParams = useSearchParams();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [categoryId, setCategoryId] = useState("");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [sortBy, setSortBy] = useState("");

  const fetchTutors = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search)     params.search     = search;
      if (categoryId) params.categoryId = categoryId;
      if (minRate)    params.minRate    = minRate;
      if (maxRate)    params.maxRate    = maxRate;
      if (sortBy)     params.sortBy     = sortBy;
      const res = await tutorsApi.getAll(params);
      setTutors(res.data);
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, minRate, maxRate, sortBy]);

  useEffect(() => { fetchTutors(); }, [fetchTutors]);
  useEffect(() => { categoriesApi.getAll().then((r) => setCategories(r.data)); }, []);

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h1>Browse Tutors</h1>
          <p>Find the perfect tutor for your learning goals</p>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="🔍  Search by name or subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {categories.length > 0 && (
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          <input type="number" placeholder="Min $/hr" value={minRate}
            onChange={(e) => setMinRate(e.target.value)} style={{ maxWidth:"110px" }} />
          <input type="number" placeholder="Max $/hr" value={maxRate}
            onChange={(e) => setMaxRate(e.target.value)} style={{ maxWidth:"110px" }} />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort by…</option>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
          <button className="btn btn-primary btn-sm" onClick={fetchTutors}>Apply</button>
          <button className="btn btn-ghost btn-sm" onClick={() => {
            setSearch(""); setCategoryId(""); setMinRate(""); setMaxRate(""); setSortBy("");
          }}>Clear</button>
        </div>

        {loading ? (
          <div style={{ textAlign:"center", padding:"4rem" }}><div className="spinner" /></div>
        ) : tutors.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No tutors found</h3>
            <p>Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <>
            <p style={{ color:"var(--text-muted)", fontSize:"0.875rem", marginBottom:"1.25rem" }}>
              Showing <strong style={{ color:"var(--text)" }}>{tutors.length}</strong> tutor{tutors.length !== 1 ? "s" : ""}
            </p>
            <div className="tutor-grid">
              {tutors.map((t) => <TutorCard key={t.id} tutor={t} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
