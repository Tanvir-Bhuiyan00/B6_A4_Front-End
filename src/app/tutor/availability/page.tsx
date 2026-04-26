"use client";
import { useState } from "react";
import { tutorsApi, AvailabilitySlot } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/Sidebar";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const emptySlot = (): AvailabilitySlot => ({ day:"Monday", startTime:"09:00", endTime:"17:00" });

export default function AvailabilityPage() {
  const { user, refetchUser } = useAuth();
  const existing: AvailabilitySlot[] = user?.tutorProfile?.availability ?? [];
  const [slots, setSlots] = useState<AvailabilitySlot[]>(existing.length ? existing : [emptySlot()]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const addSlot = () => setSlots((prev) => [...prev, emptySlot()]);
  const removeSlot = (i: number) => setSlots((prev) => prev.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof AvailabilitySlot, value: string) =>
    setSlots((prev) => prev.map((s, idx) => idx === i ? { ...s, [key]: value } : s));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess(false);
    try {
      await tutorsApi.updateAvailability({ availability: slots });
      await refetchUser();
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content fade-in">
          <div className="dashboard-header">
            <h1>Availability 🕐</h1>
            <p>Set the time slots when you&apos;re available to teach</p>
          </div>

          <div className="card">
            <form onSubmit={handleSave}>
              <div className="slot-grid">
                {slots.map((slot, i) => (
                  <div key={i} className="slot-row">
                    <select value={slot.day} onChange={(e) => update(i,"day",e.target.value)}>
                      {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <div className="form-group" style={{ margin:0 }}>
                      <label className="form-label" style={{ fontSize:"0.75rem" }}>Start</label>
                      <input type="time" value={slot.startTime}
                        onChange={(e) => update(i,"startTime",e.target.value)} required />
                    </div>
                    <div className="form-group" style={{ margin:0 }}>
                      <label className="form-label" style={{ fontSize:"0.75rem" }}>End</label>
                      <input type="time" value={slot.endTime}
                        onChange={(e) => update(i,"endTime",e.target.value)} required />
                    </div>
                    <button type="button" className="btn btn-danger btn-sm"
                      onClick={() => removeSlot(i)} disabled={slots.length === 1}>✕</button>
                  </div>
                ))}
              </div>

              <button type="button" className="btn btn-ghost btn-sm" onClick={addSlot}
                style={{ marginTop:"1rem" }}>
                + Add Slot
              </button>

              {error   && <div className="alert alert-error"   style={{ marginTop:"1rem" }}>⚠️ {error}</div>}
              {success && <div className="alert alert-success" style={{ marginTop:"1rem" }}>✅ Availability saved!</div>}

              <div style={{ marginTop:"1.5rem" }}>
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="spinner spinner-sm" /> : "Save Availability"}
                </button>
              </div>
            </form>
          </div>

          {/* Preview */}
          {slots.length > 0 && (
            <div className="card" style={{ marginTop:"1.5rem" }}>
              <h2 style={{ fontWeight:700, marginBottom:"1rem" }}>Preview</h2>
              {slots.map((s, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between",
                  padding:"0.6rem 0", borderBottom:"1px solid var(--border)" }}>
                  <span style={{ fontWeight:600 }}>{s.day}</span>
                  <span style={{ color:"var(--text-muted)" }}>{s.startTime} – {s.endTime}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
