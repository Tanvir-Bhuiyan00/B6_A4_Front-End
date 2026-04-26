"use client";
import { useEffect, useState } from "react";
import { adminApi, User, Booking } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [users,    setUsers]    = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!authLoading && user?.role === "ADMIN") {
      Promise.all([adminApi.getUsers(), adminApi.getBookings()])
        .then(([u, b]) => { setUsers(u.data); setBookings(b.data); })
        .finally(() => setLoading(false));
    }
  }, [user, authLoading]);

  if (authLoading) return <div style={{ textAlign:"center", padding:"5rem" }}><div className="spinner" /></div>;
  if (!user || user.role !== "ADMIN") return (
    <div style={{ textAlign:"center", padding:"5rem" }}>
      <h2>⛔ Admin Access Only</h2>
      <Link href="/" className="btn btn-primary" style={{ marginTop:"1rem" }}>Go Home</Link>
    </div>
  );

  const tutors   = users.filter((u) => u.role === "TUTOR");
  const students = users.filter((u) => u.role === "STUDENT");
  const banned   = users.filter((u) => u.isBanned);
  const completed = bookings.filter((b) => b.status === "COMPLETED");

  const stats = [
    { icon:"👥", number:users.length,     label:"Total Users" },
    { icon:"👨‍🏫", number:tutors.length,    label:"Tutors" },
    { icon:"🎓", number:students.length,  label:"Students" },
    { icon:"📅", number:bookings.length,  label:"Total Bookings" },
    { icon:"✅", number:completed.length, label:"Completed" },
    { icon:"🚫", number:banned.length,    label:"Banned Users" },
  ];

  return (
    <div className="container">
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content fade-in">
          <div className="dashboard-header">
            <h1>Admin Dashboard 📊</h1>
            <p>Platform-wide statistics and management</p>
          </div>

          <div className="stats-grid" style={{ gridTemplateColumns:"repeat(auto-fill, minmax(160px,1fr))" }}>
            {stats.map((s) => (
              <div key={s.label} className="card stat-card">
                <div className="stat-card-icon">{s.icon}</div>
                <div className="stat-card-number">{loading ? "—" : s.number}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))", gap:"1rem", marginTop:"1.5rem" }}>
            {[
              { href:"/admin/users",      icon:"👥", label:"Manage Users",      desc:"Ban/unban accounts" },
              { href:"/admin/bookings",   icon:"📅", label:"View Bookings",     desc:"All platform bookings" },
              { href:"/admin/categories", icon:"🗂️", label:"Manage Categories", desc:"Add or remove subjects" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="card card-hover" style={{ textAlign:"center", padding:"1.75rem" }}>
                <div style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>{item.icon}</div>
                <div style={{ fontWeight:700 }}>{item.label}</div>
                <div style={{ color:"var(--text-muted)", fontSize:"0.82rem", marginTop:"0.25rem" }}>{item.desc}</div>
              </Link>
            ))}
          </div>

          {/* Recent users */}
          <div className="card" style={{ marginTop:"1.5rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
              <h2 style={{ fontWeight:700 }}>Recent Users</h2>
              <Link href="/admin/users" className="btn btn-ghost btn-sm">View all →</Link>
            </div>
            {loading ? <div className="spinner" style={{ margin:"2rem auto" }} /> : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th></tr></thead>
                  <tbody>
                    {users.slice(0,6).map((u) => (
                      <tr key={u.id}>
                        <td><strong>{u.name}</strong></td>
                        <td style={{ color:"var(--text-muted)" }}>{u.email}</td>
                        <td><span className="badge badge-primary">{u.role}</span></td>
                        <td>{u.isBanned
                          ? <span className="badge badge-danger">Banned</span>
                          : <span className="badge badge-success">Active</span>}
                        </td>
                        <td style={{ color:"var(--text-muted)" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
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
