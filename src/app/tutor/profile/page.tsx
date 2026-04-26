"use client";
import { useState } from "react";
import { tutorsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/Sidebar";

export default function TutorProfilePage() {
  const { user, refetchUser } = useAuth();
  const p = user?.tutorProfile;

  const [form, setForm] = useState({
    bio:        p?.bio        ?? "",
    experience: p?.experience ?? "",
    education:  p?.education  ?? "",
    hourlyRate: p?.hourlyRate?.toString() ?? "",
    subjects:   p?.subjects?.join(", ") ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess(false);
    try {
      await tutorsApi.updateProfile({
        bio:        form.bio,
        experience: form.experience,
        education:  form.education,
        hourlyRate: Number(form.hourlyRate),
        subjects:   form.subjects.split(",").map((s) => s.trim()).filter(Boolean),
      });
      await refetchUser();
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content fade-in">
          <div className="dashboard-header">
            <h1>Tutor Profile 📝</h1>
            <p>Build a compelling profile to attract more students</p>
          </div>

          {/* Profile preview mini */}
          <div className="card" style={{ marginBottom:"1.5rem", display:"flex", gap:"1rem", alignItems:"center" }}>
            <div className="tutor-avatar" style={{ width:64, height:64, fontSize:"1.5rem", flexShrink:0 }}>
              {user?.name?.split(" ").map((n) => n[0]).join("").slice(0,2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:"1.1rem" }}>{user?.name}</div>
              <div style={{ color:"var(--text-muted)", fontSize:"0.85rem" }}>{user?.email}</div>
              {p?.rating && (
                <div style={{ color:"var(--warning)", marginTop:"0.25rem" }}>
                  {"★".repeat(Math.round(p.rating))} {p.rating.toFixed(1)} ({p.totalReviews} reviews)
                </div>
              )}
            </div>
            <div style={{ marginLeft:"auto" }}>
              <span className="badge badge-primary">{p ? "Profile Active" : "Profile Incomplete"}</span>
            </div>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label className="form-label">Bio / About You</label>
                <textarea value={form.bio} onChange={set("bio")} rows={4}
                  placeholder="Tell students about yourself, your teaching style, and expertise…" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Experience</label>
                  <input type="text" value={form.experience} onChange={set("experience")}
                    placeholder="e.g. 5 years teaching Math" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Education</label>
                  <input type="text" value={form.education} onChange={set("education")}
                    placeholder="e.g. BSc Computer Science, MIT" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Hourly Rate (USD)</label>
                <input type="number" value={form.hourlyRate} onChange={set("hourlyRate")}
                  placeholder="e.g. 50" min={1} required />
                <span className="form-hint">Set a competitive rate to attract students</span>
              </div>
              <div className="form-group">
                <label className="form-label">Subjects (comma-separated)</label>
                <input type="text" value={form.subjects} onChange={set("subjects")}
                  placeholder="e.g. Algebra, Calculus, Physics" required />
                <span className="form-hint">Add multiple subjects separated by commas</span>
              </div>

              {error   && <div className="alert alert-error">⚠️ {error}</div>}
              {success && <div className="alert alert-success">✅ Profile updated successfully!</div>}

              <button className="btn btn-primary" style={{ alignSelf:"flex-start" }} disabled={loading}>
                {loading ? <span className="spinner spinner-sm" /> : "Save Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
