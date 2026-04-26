import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SkillBridge — Connect with Expert Tutors",
  description:
    "SkillBridge connects learners with expert tutors. Browse tutor profiles, book sessions, and start learning today.",
  keywords: "tutoring, online learning, expert tutors, book sessions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="footer">
            <div className="container">
              <div className="footer-grid">
                <div className="footer-brand">
                  <div className="footer-logo">
                    <span className="logo-icon">🎓</span>
                    <span className="logo-text">SkillBridge</span>
                  </div>
                  <p className="footer-desc">
                    Connect with expert tutors and accelerate your learning
                    journey.
                  </p>
                </div>
                <div className="footer-links">
                  <h4>Platform</h4>
                  <ul>
                    <li>
                      <a href="/tutors">Browse Tutors</a>
                    </li>
                    <li>
                      <a href="/register">Become a Tutor</a>
                    </li>
                    <li>
                      <a href="/login">Sign In</a>
                    </li>
                  </ul>
                </div>
                <div className="footer-links">
                  <h4>Support</h4>
                  <ul>
                    <li>
                      <a href="#">Help Center</a>
                    </li>
                    <li>
                      <a href="#">Privacy Policy</a>
                    </li>
                    <li>
                      <a href="#">Terms of Service</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="footer-bottom">
                <p>© 2026 SkillBridge. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
