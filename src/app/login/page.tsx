"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem",
      background:"radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)" }}>
      <div style={{ width:"100%", maxWidth:"420px" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <Link href="/" style={{ fontSize:"2rem" }}>🎓</Link>
          <h1 style={{ fontSize:"1.75rem", fontWeight:800, marginTop:"0.75rem" }}>Welcome back</h1>
          <p style={{ color:"var(--text-muted)", marginTop:"0.4rem" }}>Sign in to your SkillBridge account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required autoComplete="email" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required autoComplete="current-password" />
            </div>
            {error && <div className="alert alert-error">⚠️ {error}</div>}
            <button id="login-submit" className="btn btn-primary" style={{ width:"100%", padding:"0.75rem" }} disabled={loading}>
              {loading ? <span className="spinner spinner-sm" /> : "Sign In"}
            </button>
          </form>
        </div>

        <p style={{ textAlign:"center", marginTop:"1.5rem", color:"var(--text-muted)", fontSize:"0.9rem" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color:"var(--brand-400)", fontWeight:600 }}>Create one →</Link>
        </p>
      </div>
    </div>
  );
}
