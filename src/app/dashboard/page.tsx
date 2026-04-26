"use client";
import { useEffect, useState } from "react";
import { bookingsApi, Booking } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      bookingsApi.getAll().then((r) => setBookings(r.data)).finally(() => setLoading(false));
    }
  }, [user, authLoading]);

  if (authLoading) return <div style={{ textAlign:"center", padding:"5rem" }}><div className="spinner" /></div>;
  if (!user || user.role !== "STUDENT") return (
    <div style={{ textAlign:"center", padding:"5rem" }}>
      <h2>Access Denied</h2>
      <Link href="/login" className="btn btn-primary" style={{ marginTop:"1rem" }}>Login</Link>
    </div>
  );

  const upcoming  = bookings.filter((b) => b.status === "CONFIRMED");
  const completed = bookings.filter((b) => b.status === "COMPLETED");
  const cancelled = bookings.filter((b) => b.status === "CANCELLED");

  return (
    <div className="container">
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content fade-in">
          <div className="dashboard-header">
            <h1>Welcome back, {user.name.split(" ")[0]} 👋</h1>
            <p>Here&apos;s an overview of your learning journey</p>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            {[
              { icon:"📅", number:upcoming.length,  label:"Upcoming Sessions" },
              { icon:"✅", number:completed.length, label:"Completed Sessions" },
              { icon:"❌", number:cancelled.length, label:"Cancelled" },
              { icon:"⭐", number:bookings.length,  label:"Total Bookings" },
            ].map((s) => (
              <div key={s.label} className="card stat-card">
                <div className="stat-card-icon">{s.icon}</div>
                <div className="stat-card-number">{s.number}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Upcoming bookings preview */}
          <div className="card" style={{ marginBottom:"1.5rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
              <h2 style={{ fontWeight:700 }}>Upcoming Sessions</h2>
              <Link href="/dashboard/bookings" className="btn btn-ghost btn-sm">View all →</Link>
            </div>
            {loading ? <div className="spinner" /> : upcoming.length === 0 ? (
              <div className="empty-state" style={{ padding:"2rem" }}>
                <div className="empty-state-icon">📅</div>
                <h3>No upcoming sessions</h3>
                <p>Find a tutor and book your first session!</p>
                <Link href="/tutors" className="btn btn-primary btn-sm">Browse Tutors</Link>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                {upcoming.slice(0, 3).map((b) => (
                  <div key={b.id} className="card" style={{ padding:"1rem", flexDirection:"row", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div className="booking-subject">{b.subject}</div>
                      <div className="booking-date">
                        with <strong>{b.tutor?.name ?? "Tutor"}</strong> · {new Date(b.date).toLocaleDateString()} · {b.startTime}–{b.endTime}
                      </div>
                    </div>
                    <span className="badge badge-success">Confirmed</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ textAlign:"center" }}>
            <Link href="/tutors" className="btn btn-primary">Find More Tutors →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
