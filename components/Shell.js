"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "./AppContext";

const NAV = [
  ["/dashboard", "dashboard"], ["/artworks", "artworks"], ["/pricing", "pricing"],
  ["/commissions", "commissions"], ["/clients", "clients"], ["/exhibitions", "exhibitions"],
  ["/sales", "sales"], ["/expenses", "expenses"], ["/settings", "settings"],
];
const MOBILE_NAV = [["/dashboard", "dashboard"], ["/artworks", "artworks"], ["/sales", "sales"], ["/clients", "clients"], ["/settings", "more"]];

export default function Shell({ children }) {
  const { t, lang, profile, logout } = useApp();
  const pathname = usePathname();
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir} style={{
      "--font-display": lang === "ar" ? "'Amiri', serif" : "'Fraunces', serif",
      "--font-body": lang === "ar" ? "'IBM Plex Sans Arabic', sans-serif" : "'Inter', sans-serif",
      fontFamily: "var(--font-body)", background: "#F5F1E8", minHeight: "100vh", color: "#2B2925",
    }}>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <div className="abs-sidebar" style={{ width: 220, background: "#2B2925", color: "#EDE7D9", padding: "24px 16px", flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 19, marginBottom: 4, lineHeight: 1.25 }}>
            {profile?.studio_name || profile?.artist_name || t.appName}
          </div>
          <div style={{ fontSize: 11.5, color: "#8A8371", marginBottom: 26 }}>{t.tagline}</div>
          {NAV.map(([href, key]) => (
            <Link key={href} href={href} style={{
              display: "block", width: "100%", textAlign: "inherit", padding: "10px 14px", borderRadius: 8,
              background: pathname === href ? "#3A3732" : "transparent",
              color: pathname === href ? "#EDE7D9" : "#C9C2AE", fontWeight: pathname === href ? 600 : 400,
              fontSize: 14.5, textDecoration: "none", marginBottom: 2,
            }}>{t.nav[key]}</Link>
          ))}
          <button onClick={logout} style={{ marginTop: 20, background: "none", border: "1px solid #4A473F", borderRadius: 8, color: "#C9C2AE", padding: "8px 14px", fontSize: 13, cursor: "pointer", width: "100%" }}>{t.nav.logout}</button>
        </div>

        <div className="abs-main" style={{ flex: 1, padding: "28px 32px 90px", maxWidth: 1100 }}>
          {children}
        </div>
      </div>

      <div className="abs-bottomnav" style={{ display: "none" }}>
        {MOBILE_NAV.map(([href, key]) => (
          <Link key={href} href={href} style={{ color: pathname === href ? "#EDE7D9" : "#C9C2AE", fontWeight: pathname === href ? 700 : 400, fontSize: 11.5, textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 6px" }}>
            {t.nav[key]}
          </Link>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&family=Amiri:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: start; font-size: 12px; text-transform: uppercase; letter-spacing: .4px; color: #8A8371; padding: 8px 10px; border-bottom: 1px solid #EAE3D2; }
        td { padding: 10px; border-bottom: 1px solid #F0EBDD; font-size: 14px; }
        tr:hover td { background: #FBF8F1; }
        @media (max-width: 860px) {
          .abs-sidebar { display: none; }
          .abs-main { padding: 18px 16px 90px !important; }
          .abs-bottomnav { display: flex !important; position: fixed; bottom: 0; inset-inline: 0; background: #2B2925; z-index: 40; justify-content: space-around; padding: 8px 4px; }
        }
      `}</style>
    </div>
  );
}
