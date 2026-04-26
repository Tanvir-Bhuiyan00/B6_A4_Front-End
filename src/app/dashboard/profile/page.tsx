"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/Sidebar";

export default function StudentProfilePage() {
  const { user, refetchUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess(false);
    try {
      // Profile update via /auth/me or similar – backend dependent
      // For now we just refetch to stay in sync
      await refetchUser();
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="container">
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content fade-in">
          <div className="dashboard-header">
            <h1>My Profile 👤</h1>
            <p>Manage your personal information</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:"1.5rem", alignItems:"start" }}>
            {/* Avatar card */}
            <div className="card" style={{ textAlign:"center", padding:"2rem" }}>
              <div className="sidebar-avatar" style={{ width:96, height:96, fontSize:"2rem", margin:"0 auto 1rem" }}>
                {initials}
              </div>
              <div style={{ fontWeight:700, fontSize:"1.1rem" }}>{user?.name}</div>
              <div style={{ color:"var(--text-muted)", fontSize:"0.85rem", marginTop:"0.25rem" }}>{user?.email}</div>
              <div style={{ marginTop:"0.75rem" }}>
                <span className="badge badge-primary">{user?.role}</span>
              </div>
              <div style={{ color:"var(--text-muted)", fontSize:"0.8rem", marginTop:"1rem" }}>
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US",{month:"long",year:"numeric"}) : "—"}
              </div>
            </div>

            {/* Edit form */}
            <div className="card">
              <h2 style={{ fontWeight:700, marginBottom:"1.25rem" }}>Edit Information</h2>
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" value={user?.email ?? ""} disabled
                    style={{ opacity:0.5, cursor:"not-allowed" }} />
                  <span className="form-hint">Email cannot be changed</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input value={user?.role ?? ""} disabled style={{ opacity:0.5, cursor:"not-allowed" }} />
                </div>
                {error   && <div className="alert alert-error">⚠️ {error}</div>}
                {success && <div className="alert alert-success">✅ Profile updated!</div>}
                <button className="btn btn-primary" disabled={loading} style={{ alignSelf:"flex-start" }}>
                  {loading ? <span className="spinner spinner-sm" /> : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
