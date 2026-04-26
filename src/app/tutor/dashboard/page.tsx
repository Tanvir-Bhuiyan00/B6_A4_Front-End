"use client";
import { useEffect, useState } from "react";
import { bookingsApi, Booking } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";

export default function TutorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      bookingsApi.getAll().then((r) => setBookings(r.data)).finally(() => setLoading(false));
    }
  }, [user, authLoading]);

  if (authLoading) return <div style={{ textAlign:"center", padding:"5rem" }}><div className="spinner" /></div>;
  if (!user || user.role !== "TUTOR") return (
    <div style={{ textAlign:"center", padding:"5rem" }}>
      <h2>Access Denied</h2>
      <Link href="/login" className="btn btn-primary" style={{ marginTop:"1rem" }}>Login</Link>
    </div>
  );

  const p = user.tutorProfile;
  const upcoming  = bookings.filter((b) => b.status === "CONFIRMED");
  const completed = bookings.filter((b) => b.status === "COMPLETED");
  const earnings  = completed.reduce((sum, b) => sum + (p?.hourlyRate ?? 0), 0);

  const statusBadge = (s: string) => {
    if (s === "CONFIRMED") return <span className="badge badge-success">Confirmed</span>;
    if (s === "COMPLETED") return <span className="badge badge-primary">Completed</span>;
    if (s === "CANCELLED") return <span className="badge badge-danger">Cancelled</span>;
    return null;
  };

  return (
    <div className="container">
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content fade-in">
          <div className="dashboard-header">
            <h1>Tutor Dashboard 👨‍🏫</h1>
            <p>Manage your teaching sessions and profile</p>
          </div>

          {/* Profile incomplete warning */}
          {!p && (
            <div className="alert alert-info" style={{ marginBottom:"1.5rem" }}>
              ⚡ Complete your tutor profile to start receiving bookings.{" "}
              <Link href="/tutor/profile" style={{ fontWeight:700, textDecoration:"underline" }}>Set up profile →</Link>
            </div>
          )}

          {/* Stats */}
          <div className="stats-grid">
            {[
              { icon:"📅", number:upcoming.length,  label:"Upcoming Sessions" },
              { icon:"✅", number:completed.length, label:"Completed Sessions" },
              { icon:"⭐", number:p?.rating?.toFixed(1) ?? "—", label:"Avg Rating" },
              { icon:"💰", number:`$${earnings}`, label:"Est. Earnings" },
            ].map((s) => (
              <div key={s.label} className="card stat-card">
                <div className="stat-card-icon">{s.icon}</div>
                <div className="stat-card-number">{s.number}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent sessions */}
          <div className="card">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
              <h2 style={{ fontWeight:700 }}>Recent Sessions</h2>
            </div>
            {loading ? <div className="spinner" style={{ margin:"2rem auto" }} /> : bookings.length === 0 ? (
              <div className="empty-state" style={{ padding:"2rem" }}>
                <div className="empty-state-icon">📭</div>
                <h3>No sessions yet</h3>
                <p>Students will book sessions once your profile is complete.</p>
                <Link href="/tutor/profile" className="btn btn-primary btn-sm">Complete Profile</Link>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th><th>Subject</th><th>Date</th><th>Time</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 8).map((b) => (
                      <tr key={b.id}>
                        <td><strong>{b.student?.name ?? "—"}</strong></td>
                        <td>{b.subject}</td>
                        <td>{new Date(b.date).toLocaleDateString()}</td>
                        <td style={{ whiteSpace:"nowrap" }}>{b.startTime} – {b.endTime}</td>
                        <td>{statusBadge(b.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
