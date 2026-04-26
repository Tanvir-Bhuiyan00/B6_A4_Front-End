"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "";

  const dashboardHref =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "TUTOR"
      ? "/tutor/dashboard"
      : "/dashboard";

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">SkillBridge</span>
          </Link>

          <div className="navbar-links">
            <Link href="/" className={`navbar-link${pathname === "/" ? " active" : ""}`}>Home</Link>
            <Link href="/tutors" className={`navbar-link${pathname.startsWith("/tutors") ? " active" : ""}`}>Browse Tutors</Link>
          </div>

          <div className="navbar-actions">
            {user ? (
              <>
                <Link href={dashboardHref} className="btn btn-ghost btn-sm">Dashboard</Link>
                <div className="navbar-avatar" title={user.name}>{initials}</div>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}
            <button className="navbar-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          </div>
        </div>

        {menuOpen && (
          <div style={{ padding: "1rem 0", borderTop: "1px solid var(--border)" }}>
            <Link href="/" className="navbar-link" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/tutors" className="navbar-link" onClick={() => setMenuOpen(false)}>Browse Tutors</Link>
            {user ? (
              <>
                <Link href={dashboardHref} className="navbar-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button className="navbar-link" onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="navbar-link" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link href="/register" className="navbar-link" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
