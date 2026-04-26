"use client";
import { useEffect, useState } from "react";
import { adminApi, Category } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/Sidebar";

export default function AdminCategoriesPage() {
  const { user, loading: authLoading } = useAuth();
  const [categories, setCategories]   = useState<Category[]>([]);
  const [loading,    setLoading]      = useState(true);
  const [name,       setName]         = useState("");
  const [description,setDescription]  = useState("");
  const [saving,     setSaving]       = useState(false);
  const [deleting,   setDeleting]     = useState<string | null>(null);
  const [error,      setError]        = useState("");
  const [success,    setSuccess]      = useState("");

  const load = () => {
    adminApi.getCategories()
      .then((r) => setCategories(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (!authLoading && user?.role === "ADMIN") load(); }, [user, authLoading]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    try {
      await adminApi.createCategory({ name, description: description || undefined });
      setName(""); setDescription("");
      setSuccess(`Category "${name}" created!`);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Delete category "${catName}"? This cannot be undone.`)) return;
    setDeleting(id); setError(""); setSuccess("");
    try {
      await adminApi.deleteCategory(id);
      setSuccess(`Category "${catName}" deleted.`);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete category");
    } finally {
      setDeleting(null);
    }
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
            <h1>Manage Categories 🗂️</h1>
            <p>Add or remove tutoring subject categories</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:"1.5rem", alignItems:"start" }}>

            {/* Create form */}
            <div className="card">
              <h2 style={{ fontWeight:700, marginBottom:"1.25rem" }}>Add Category</h2>
              <form onSubmit={handleCreate} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                <div className="form-group">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text" value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mathematics" required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description (optional)</label>
                  <textarea
                    rows={3} value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of this category…"
                  />
                </div>
                {error   && <div className="alert alert-error">⚠️ {error}</div>}
                {success && <div className="alert alert-success">✅ {success}</div>}
                <button className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner spinner-sm" /> : "+ Create Category"}
                </button>
              </form>
            </div>

            {/* List */}
            <div className="card">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
                <h2 style={{ fontWeight:700 }}>All Categories</h2>
                <span className="badge badge-muted">{categories.length} total</span>
              </div>
              {loading ? (
                <div style={{ textAlign:"center", padding:"2rem" }}><div className="spinner" /></div>
              ) : categories.length === 0 ? (
                <div className="empty-state" style={{ padding:"2rem" }}>
                  <div className="empty-state-icon">🗂️</div>
                  <h3>No categories yet</h3>
                  <p>Create your first category to help organise tutors by subject.</p>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                  {categories.map((c) => (
                    <div key={c.id}
                      style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                        padding:"0.85rem 1rem", background:"var(--bg-surface)",
                        borderRadius:"var(--radius)", border:"1px solid var(--border)" }}
                    >
                      <div>
                        <div style={{ fontWeight:600 }}>{c.name}</div>
                        {c.description && (
                          <div style={{ fontSize:"0.8rem", color:"var(--text-muted)", marginTop:"0.2rem" }}>
                            {c.description}
                          </div>
                        )}
                      </div>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(c.id, c.name)}
                        disabled={deleting === c.id}
                      >
                        {deleting === c.id ? <span className="spinner spinner-sm" /> : "Delete"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
