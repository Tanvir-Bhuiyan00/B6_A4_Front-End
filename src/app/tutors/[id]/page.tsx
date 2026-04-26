"use client";
import { useEffect, useState } from "react";
import { tutorsApi, bookingsApi, Tutor, Review } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";

export default function TutorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [booking, setBooking] = useState({ date:"", startTime:"", endTime:"", subject:"", notes:"" });
  const [bLoading, setBLoading] = useState(false);
  const [bError, setBError] = useState("");
  const [bSuccess, setBSuccess] = useState(false);

  useEffect(() => {
    tutorsApi.getById(id).then((r) => setTutor(r.data)).finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    setBLoading(true); setBError("");
    try {
      await bookingsApi.create({ tutorId: id, ...booking });
      setBSuccess(true);
      setBookingOpen(false);
    } catch (err: unknown) {
      setBError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setBLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign:"center", padding:"5rem" }}><div className="spinner" /></div>;
  if (!tutor) return <div style={{ textAlign:"center", padding:"5rem" }}><h2>Tutor not found</h2></div>;

  const p = tutor.tutorProfile;
  const initials = tutor.name.split(" ").map((n) => n[0]).join("").slice(0,2).toUpperCase();
  const stars = p?.rating ? Math.round(p.rating) : 0;
  const reviews: Review[] = [];

  return (
    <div className="section">
      <div className="container">
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:"2rem", alignItems:"start" }}>

          {/* Left: Profile */}
          <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>

            {/* Header card */}
            <div className="card">
              <div style={{ display:"flex", gap:"1.5rem", alignItems:"flex-start" }}>
                <div className="tutor-avatar" style={{ width:96, height:96, fontSize:"2.2rem" }}>
                  {tutor.avatar ? <img src={tutor.avatar} alt={tutor.name} /> : initials}
                </div>
                <div style={{ flex:1 }}>
                  <h1 style={{ fontSize:"1.6rem", fontWeight:800 }}>{tutor.name}</h1>
                  {p?.experience && <p style={{ color:"var(--text-muted)", marginTop:"0.25rem" }}>🎓 {p.experience}</p>}
                  {p?.education  && <p style={{ color:"var(--text-muted)", fontSize:"0.875rem" }}>🏫 {p.education}</p>}
                  <div className="tutor-rating" style={{ marginTop:"0.5rem", fontSize:"1rem" }}>
                    {"★".repeat(stars)}{"☆".repeat(5-stars)}
                    <span style={{ color:"var(--text-muted)", fontWeight:400, fontSize:"0.875rem" }}>
                      &nbsp;{p?.rating?.toFixed(1) ?? "–"} ({p?.totalReviews ?? 0} reviews)
                    </span>
                  </div>
                  <div style={{ marginTop:"0.75rem", display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
                    {p?.subjects?.map((s) => <span key={s} className="badge badge-primary">{s}</span>)}
                  </div>
                </div>
                {p?.hourlyRate && (
                  <div style={{ textAlign:"right" }}>
                    <div className="tutor-rate" style={{ fontSize:"1.5rem" }}>${p.hourlyRate}<span>/hr</span></div>
                  </div>
                )}
              </div>
            </div>

            {/* About */}
            {p?.bio && (
              <div className="card">
                <h2 style={{ fontWeight:700, marginBottom:"0.75rem" }}>About</h2>
                <p style={{ color:"var(--text-muted)", lineHeight:1.8 }}>{p.bio}</p>
              </div>
            )}

            {/* Availability */}
            {p?.availability?.length ? (
              <div className="card">
                <h2 style={{ fontWeight:700, marginBottom:"1rem" }}>Availability</h2>
                <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                  {p.availability.map((slot, i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"0.6rem 0", borderBottom:"1px solid var(--border)" }}>
                      <span style={{ fontWeight:600 }}>{slot.day}</span>
                      <span style={{ color:"var(--text-muted)" }}>{slot.startTime} – {slot.endTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Reviews */}
            <div className="card">
              <h2 style={{ fontWeight:700, marginBottom:"1rem" }}>Reviews</h2>
              {reviews.length === 0 ? (
                <p style={{ color:"var(--text-muted)" }}>No reviews yet. Be the first to review!</p>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                  {reviews.map((r: Review) => (
                    <div key={r.id} style={{ borderBottom:"1px solid var(--border)", paddingBottom:"1rem" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.4rem" }}>
                        <strong>{r.student?.name ?? "Student"}</strong>
                        <span style={{ color:"var(--warning)" }}>{"★".repeat(r.rating)}</span>
                      </div>
                      <p style={{ color:"var(--text-muted)", fontSize:"0.875rem" }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking widget */}
          <div style={{ position:"sticky", top:"80px" }}>
            <div className="card">
              <h2 style={{ fontWeight:700, marginBottom:"0.25rem" }}>Book a Session</h2>
              <p style={{ color:"var(--text-muted)", fontSize:"0.875rem", marginBottom:"1.25rem" }}>
                Sessions are confirmed instantly
              </p>
              {bSuccess && <div className="alert alert-success" style={{ marginBottom:"1rem" }}>✅ Booking confirmed!</div>}
              {!bSuccess && (
                <form onSubmit={handleBook} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input type="text" value={booking.subject} placeholder="e.g. Algebra, Python…"
                      onChange={(e) => setBooking((p) => ({ ...p, subject:e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input type="date" value={booking.date}
                      onChange={(e) => setBooking((p) => ({ ...p, date:e.target.value }))} required />
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
                    <div className="form-group">
                      <label className="form-label">Start</label>
                      <input type="time" value={booking.startTime}
                        onChange={(e) => setBooking((p) => ({ ...p, startTime:e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End</label>
                      <input type="time" value={booking.endTime}
                        onChange={(e) => setBooking((p) => ({ ...p, endTime:e.target.value }))} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes (optional)</label>
                    <textarea rows={2} value={booking.notes} placeholder="Any specific topics or goals…"
                      onChange={(e) => setBooking((p) => ({ ...p, notes:e.target.value }))} />
                  </div>
                  {bError && <div className="alert alert-error">⚠️ {bError}</div>}
                  <button className="btn btn-primary" style={{ width:"100%", padding:"0.75rem" }} disabled={bLoading}>
                    {bLoading ? <span className="spinner spinner-sm" /> : user ? "Confirm Booking" : "Login to Book"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
