"use client";
import { useEffect, useState } from "react";
import { adminApi, Booking } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/Sidebar";

export default function AdminBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (!authLoading && user?.role === "ADMIN") {
      adminApi.getBookings().then((r) => setBookings(r.data)).finally(() => setLoading(false));
    }
  }, [user, authLoading]);

  const filtered = bookings.filter((b) => {
    const matchSearch = !search ||
      b.subject.toLowerCase().includes(search.toLowerCase()) ||
      (b.student?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (b.tutor?.name   ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusBadge = (s: string) => {
    if (s === "CONFIRMED") return <span className="badge badge-success">Confirmed</span>;
    if (s === "COMPLETED") return <span className="badge badge-primary">Completed</span>;
    if (s === "CANCELLED") return <span className="badge badge-danger">Cancelled</span>;
    return null;
  };

  if (!authLoading && user?.role !== "ADMIN") return (
    <div style={{ textAlign:"center", padding:"5rem" }}><h2>⛔ Admin Access Only</h2></div>
  );

  return (
    <div className="container">
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content fade-in">
          <div className="dashboard-header">
            <h1>All Bookings 📅</h1>
            <p>Monitor every session booked on the platform</p>
          </div>

          {/* Summary badges */}
          <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", marginBottom:"1.5rem" }}>
            {[
              { label:"Total",     count:bookings.length,                                  cls:"badge-muted" },
              { label:"Confirmed", count:bookings.filter((b)=>b.status==="CONFIRMED").length, cls:"badge-success" },
              { label:"Completed", count:bookings.filter((b)=>b.status==="COMPLETED").length, cls:"badge-primary" },
              { label:"Cancelled", count:bookings.filter((b)=>b.status==="CANCELLED").length, cls:"badge-danger" },
            ].map((item) => (
              <span key={item.label} className={`badge ${item.cls}`} style={{ padding:"0.35rem 0.9rem", fontSize:"0.85rem" }}>
                {item.label}: {loading ? "—" : item.count}
              </span>
            ))}
          </div>

          {/* Filters */}
          <div className="filter-bar" style={{ marginBottom:"1.5rem" }}>
            <input type="text" placeholder="🔍  Search subject, student, tutor…"
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ maxWidth:160 }}>
              <option value="">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <div style={{ textAlign:"center", padding:"3rem" }}><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3>No bookings found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Student</th>
                    <th>Tutor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id}>
                      <td><strong>{b.subject}</strong></td>
                      <td>{b.student?.name ?? "—"}</td>
                      <td>{b.tutor?.name   ?? "—"}</td>
                      <td style={{ whiteSpace:"nowrap", color:"var(--text-muted)" }}>
                        {new Date(b.date).toLocaleDateString()}
                      </td>
                      <td style={{ whiteSpace:"nowrap", color:"var(--text-muted)" }}>
                        {b.startTime} – {b.endTime}
                      </td>
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
  );
}
