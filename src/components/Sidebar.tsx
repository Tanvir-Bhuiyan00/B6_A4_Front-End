"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface SidebarLink { href: string; label: string; icon: string; }

const studentLinks: SidebarLink[] = [
  { href: "/dashboard",          label: "Overview",    icon: "📊" },
  { href: "/dashboard/bookings", label: "My Bookings", icon: "📅" },
  { href: "/dashboard/profile",  label: "Profile",     icon: "👤" },
];

const tutorLinks: SidebarLink[] = [
  { href: "/tutor/dashboard",    label: "Dashboard",    icon: "📊" },
  { href: "/tutor/availability", label: "Availability", icon: "🕐" },
  { href: "/tutor/profile",      label: "Profile",      icon: "👤" },
];

const adminLinks: SidebarLink[] = [
  { href: "/admin",              label: "Dashboard",   icon: "📊" },
  { href: "/admin/users",        label: "Users",       icon: "👥" },
  { href: "/admin/bookings",     label: "Bookings",    icon: "📅" },
  { href: "/admin/categories",   label: "Categories",  icon: "🗂️" },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const links =
    user?.role === "ADMIN" ? adminLinks :
    user?.role === "TUTOR" ? tutorLinks :
    studentLinks;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <aside className="sidebar">
      <div className="sidebar-user">
        <div className="sidebar-avatar">{initials}</div>
        <div className="sidebar-name">{user?.name}</div>
        <div className="sidebar-role">{user?.role}</div>
      </div>
      <nav className="sidebar-nav">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={pathname === l.href ? "active" : ""}
          >
            <span>{l.icon}</span>
            {l.label}
          </Link>
        ))}
        <button
          onClick={logout}
          style={{ display:"flex", alignItems:"center", gap:"0.65rem",
            padding:"0.6rem 0.85rem", borderRadius:"var(--radius)",
            fontSize:"0.9rem", color:"var(--danger)", marginTop:"0.5rem",
            width:"100%", textAlign:"left" }}
        >
          <span>🚪</span> Logout
        </button>
      </nav>
    </aside>
  );
}
