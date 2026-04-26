"use client";
import { useEffect, useState } from "react";
import { adminApi, User } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/Sidebar";

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const [users,   setUsers]   = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = () => {
    adminApi.getUsers().then((r) => setUsers(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { if (!authLoading && user?.role === "ADMIN") load(); }, [user, authLoading]);

  const toggleBan = async (u: User) => {
    setActionLoading(u.id);
    try {
      await adminApi.updateUser(u.id, { isBanned: !u.isBanned });
      load();
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (!authLoading && user?.role !== "ADMIN") return (
    <div style={{ textAlign:"center", padding:"5rem" }}><h2>⛔ Admin Access Only</h2></div>
  );

  return (
    <div className="container">
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content fade-in">
          <div className="dashboard-header">
            <h1>Manage Users 👥</h1>
            <p>View and moderate all platform users</p>
          </div>

          {/* Filters */}
          <div className="filter-bar" style={{ marginBottom:"1.5rem" }}>
            <input type="text" placeholder="🔍  Search by name or email…"
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ maxWidth:160 }}>
              <option value="">All Roles</option>
              <option value="STUDENT">Students</option>
              <option value="TUTOR">Tutors</option>
              <option value="ADMIN">Admins</option>
            </select>
            <span style={{ color:"var(--text-muted)", fontSize:"0.85rem", marginLeft:"auto" }}>
              {filtered.length} user{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign:"center", padding:"3rem" }}><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No users found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
                          <div style={{
                            width:34, height:34, borderRadius:"50%", flexShrink:0,
                            background:"linear-gradient(135deg,var(--brand-500),var(--accent-500))",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:"0.75rem", fontWeight:700, color:"#fff"
                          }}>
                            {u.name.split(" ").map((n) => n[0]).join("").slice(0,2).toUpperCase()}
                          </div>
                          <strong>{u.name}</strong>
                        </div>
                      </td>
                      <td style={{ color:"var(--text-muted)" }}>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role==="ADMIN" ? "badge-warning" : u.role==="TUTOR" ? "badge-primary" : "badge-muted"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ color:"var(--text-muted)", whiteSpace:"nowrap" }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        {u.isBanned
                          ? <span className="badge badge-danger">Banned</span>
                          : <span className="badge badge-success">Active</span>}
                      </td>
                      <td>
                        {u.role !== "ADMIN" && (
                          <button
                            className={`btn btn-sm ${u.isBanned ? "btn-success" : "btn-danger"}`}
                            onClick={() => toggleBan(u)}
                            disabled={actionLoading === u.id}
                          >
                            {actionLoading === u.id
                              ? <span className="spinner spinner-sm" />
                              : u.isBanned ? "Unban" : "Ban"}
                          </button>
                        )}
                      </td>
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
