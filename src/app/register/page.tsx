"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"STUDENT" as "STUDENT"|"TUTOR" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await register(form.name, form.email, form.password, form.role);
      const dest = form.role === "TUTOR" ? "/tutor/dashboard" : "/dashboard";
      router.push(dest);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem",
      background:"radial-gradient(ellipse 70% 50% at 50% 0%, rgba(236,72,153,0.12) 0%, transparent 70%)" }}>
      <div style={{ width:"100%", maxWidth:"460px" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <Link href="/" style={{ fontSize:"2rem" }}>🎓</Link>
          <h1 style={{ fontSize:"1.75rem", fontWeight:800, marginTop:"0.75rem" }}>Create your account</h1>
          <p style={{ color:"var(--text-muted)", marginTop:"0.4rem" }}>Join SkillBridge today — it&apos;s free</p>
        </div>

        {/* Role selector */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem", marginBottom:"1.5rem" }}>
          {(["STUDENT","TUTOR"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setForm((p) => ({ ...p, role:r }))}
              className={`card${form.role === r ? "" : ""}`}
              style={{
                textAlign:"center", padding:"1.25rem",
                border:`2px solid ${form.role===r ? "var(--brand-500)" : "var(--border)"}`,
                background: form.role===r ? "rgba(99,102,241,0.1)" : "var(--bg-card)",
                borderRadius:"var(--radius)", cursor:"pointer", transition:"all 0.2s"
              }}
            >
              <div style={{ fontSize:"1.75rem", marginBottom:"0.4rem" }}>{r==="STUDENT" ? "🎓" : "👨‍🏫"}</div>
              <div style={{ fontWeight:700 }}>{r === "STUDENT" ? "Student" : "Tutor"}</div>
              <div style={{ fontSize:"0.8rem", color:"var(--text-muted)", marginTop:"0.2rem" }}>
                {r === "STUDENT" ? "I want to learn" : "I want to teach"}
              </div>
            </button>
          ))}
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input id="reg-name" type="text" value={form.name} onChange={set("name")}
                placeholder="John Doe" required autoComplete="name" />
            </div>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input id="reg-email" type="email" value={form.email} onChange={set("email")}
                placeholder="you@example.com" required autoComplete="email" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input id="reg-password" type="password" value={form.password} onChange={set("password")}
                placeholder="Min. 8 characters" required minLength={8} autoComplete="new-password" />
            </div>
            {error && <div className="alert alert-error">⚠️ {error}</div>}
            <button id="reg-submit" className="btn btn-primary" style={{ width:"100%", padding:"0.75rem" }} disabled={loading}>
              {loading ? <span className="spinner spinner-sm" /> : `Create ${form.role === "TUTOR" ? "Tutor" : "Student"} Account`}
            </button>
          </form>
        </div>

        <p style={{ textAlign:"center", marginTop:"1.5rem", color:"var(--text-muted)", fontSize:"0.9rem" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color:"var(--brand-400)", fontWeight:600 }}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
