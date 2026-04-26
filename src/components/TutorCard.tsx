import { Tutor } from "@/lib/api";
import Link from "next/link";

export function TutorCard({ tutor }: { tutor: Tutor }) {
  const profile = tutor.tutorProfile;
  const initials = tutor.name
    .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const stars = profile?.rating
    ? Math.round(profile.rating)
    : 0;

  return (
    <div className="card card-hover tutor-card fade-in">
      <div className="tutor-card-header">
        <div className="tutor-avatar">
          {tutor.avatar
            ? <img src={tutor.avatar} alt={tutor.name} />
            : initials}
        </div>
        <div>
          <div className="tutor-name">{tutor.name}</div>
          {profile?.experience && (
            <div className="tutor-meta">🎓 {profile.experience}</div>
          )}
          <div className="tutor-rating">
            {"★".repeat(stars)}{"☆".repeat(5 - stars)}
            <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
              ({profile?.totalReviews ?? 0})
            </span>
          </div>
        </div>
      </div>

      {profile?.subjects?.length ? (
        <div className="tutor-subjects">
          {profile.subjects.slice(0, 3).map((s) => (
            <span key={s} className="badge badge-primary">{s}</span>
          ))}
          {profile.subjects.length > 3 && (
            <span className="badge badge-muted">+{profile.subjects.length - 3}</span>
          )}
        </div>
      ) : null}

      {profile?.bio && <p className="tutor-bio">{profile.bio}</p>}

      <div className="tutor-footer">
        <div className="tutor-rate">
          ${profile?.hourlyRate ?? "–"}<span>/hr</span>
        </div>
        <Link href={`/tutors/${tutor.id}`} className="btn btn-primary btn-sm">
          View Profile
        </Link>
      </div>
    </div>
  );
}
