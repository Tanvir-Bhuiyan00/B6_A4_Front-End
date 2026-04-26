"use client";
import { useState } from "react";
import { reviewsApi } from "@/lib/api";

interface Props {
  tutorId: string;
  bookingId: string;
  onSuccess: () => void;
}

export function ReviewForm({ tutorId, bookingId, onSuccess }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setError("Please select a rating"); return; }
    setLoading(true); setError("");
    try {
      await reviewsApi.create({ tutorId, bookingId, rating, comment });
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
      <div className="form-group">
        <label className="form-label">Rating</label>
        <div className="stars">
          {[1,2,3,4,5].map((n) => (
            <span
              key={n}
              className={`star${n <= rating ? " filled" : ""}`}
              onClick={() => setRating(n)}
              style={{ fontSize:"1.6rem" }}
            >★</span>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Share your experience..."
          required
        />
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <button className="btn btn-primary" disabled={loading}>
        {loading ? <span className="spinner spinner-sm" /> : "Submit Review"}
      </button>
    </form>
  );
}
