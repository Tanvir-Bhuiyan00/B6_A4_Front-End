"use client";
import { useEffect, useState } from "react";
import { bookingsApi, Booking } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { ReviewForm } from "@/components/ReviewForm";

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
  const [tab, setTab] = useState<"CONFIRMED"|"COMPLETED"|"CANCELLED">("CONFIRMED");

  const load = () => {
    bookingsApi.getAll().then((r) => setBookings(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { if (!authLoading && user) load(); }, [user, authLoading]);

  const filtered = bookings.filter((b) => b.status === tab);

  const statusBadge = (s: string) => {
    if (s === "CONFIRMED")  return <span className="badge badge-success">Confirmed</span>;
    if (s === "COMPLETED")  return <span className="badge badge-primary">Completed</span>;
    if (s === "CANCELLED")  return <span className="badge badge-danger">Cancelled</span>;
    return null;
  };

  return (
    <div className="container">
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content fade-in">
          <div className="dashboard-header">
            <h1>My Bookings 📅</h1>
            <p>Manage all your tutoring sessions</p>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1.5rem" }}>
            {(["CONFIRMED","COMPLETED","CANCELLED"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`btn btn-sm ${tab===t ? "btn-primary" : "btn-ghost"}`}>
                {t.charAt(0) + t.slice(1).toLowerCase()}
                <span className="badge badge-muted" style={{ marginLeft:"0.3rem" }}>
                  {bookings.filter((b) => b.status===t).length}
                </span>
              </button>
            ))}
          </div>

          {loading ? <div className="spinner" style={{ margin:"3rem auto" }} /> : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3>No {tab.toLowerCase()} bookings</h3>
              <p>Your {tab.toLowerCase()} sessions will appear here.</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              {filtered.map((b) => (
                <div key={b.id} className="card">
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"0.75rem" }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:"1.05rem" }}>{b.subject}</div>
                      <div style={{ color:"var(--text-muted)", fontSize:"0.85rem", marginTop:"0.25rem" }}>
                        Tutor: <strong style={{ color:"var(--text)" }}>{b.tutor?.name ?? "—"}</strong>
                      </div>
                      <div style={{ color:"var(--text-muted)", fontSize:"0.85rem" }}>
                        📅 {new Date(b.date).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
                        &nbsp;·&nbsp;⏰ {b.startTime} – {b.endTime}
                      </div>
                      {b.notes && <div style={{ color:"var(--text-muted)", fontSize:"0.82rem", marginTop:"0.25rem" }}>📝 {b.notes}</div>}
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem", alignItems:"flex-end" }}>
                      {statusBadge(b.status)}
                      {b.status === "COMPLETED" && !b.review && (
                        <button className="btn btn-outline btn-sm" onClick={() => setReviewTarget(b)}>
                          Leave Review ⭐
                        </button>
                      )}
                      {b.review && <span className="badge badge-warning">Reviewed ⭐{b.review.rating}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review modal */}
      {reviewTarget && (
        <div className="modal-overlay" onClick={() => setReviewTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Review Session</h2>
              <button className="modal-close" onClick={() => setReviewTarget(null)}>✕</button>
            </div>
            <p style={{ color:"var(--text-muted)", marginBottom:"1rem" }}>
              Rate your session on <strong>{reviewTarget.subject}</strong>
            </p>
            <ReviewForm
              tutorId={reviewTarget.tutorId}
              bookingId={reviewTarget.id}
              onSuccess={() => { setReviewTarget(null); load(); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
