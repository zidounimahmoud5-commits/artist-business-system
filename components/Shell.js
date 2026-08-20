"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "./AppContext";

const INK_DARK = "#1E1A16";
const SIDEBAR_HOVER = "#2A241D";
const BG = "#FAF7F0";
const TEXT_ON_DARK = "#EDE7D9";
const TEXT_ON_DARK_MUTED = "#B5AC98";
const BORDER_ON_DARK = "#3A342B";

const NAV = [
  ["/dashboard", "dashboard"], ["/artworks", "artworks"], ["/pricing", "pricing"],
  ["/commissions", "commissions"], ["/clients", "clients"], ["/exhibitions", "exhibitions"],
  ["/sales", "sales"], ["/expenses", "expenses"], ["/settings", "settings"],
];
const MOBILE_NAV = [["/dashboard", "dashboard"], ["/artworks", "artworks"], ["/sales", "sales"], ["/clients", "clients"], ["/more", "more"]];

export default function Shell({ children }) {
  const { t, lang, profile, logout, setLanguage } = useApp();
  const pathname = usePathname();
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir} style={{
      "--font-display": lang === "ar" ? "'Amiri', serif" : "'Fraunces', serif",
      "--font-body": lang === "ar" ? "'IBM Plex Sans Arabic', sans-serif" : "'Inter', sans-serif",
      fontFamily: "var(--font-body)", background: BG, minHeight: "100vh", color: "#241F1A",
    }}>
      <div className="abs-topbar" style={{ display: "none" }}>
        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 17, color: TEXT_ON_DARK }}>
          {profile?.studio_name || profile?.artist_name || t.appName}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setLanguage(lang === "ar" ? "en" : "ar")} style={{
            background: "none", border: `1px solid ${BORDER_ON_DARK}`, borderRadius: 8, color: TEXT_ON_DARK_MUTED,
            padding: "6px 12px", fontSize: 13, cursor: "pointer",
          }}>{lang === "ar" ? "EN" : "AR"}</button>
          <button onClick={logout} style={{
            background: "none", border: `1px solid ${BORDER_ON_DARK}`, borderRadius: 8, color: TEXT_ON_DARK_MUTED,
            padding: "6px 12px", fontSize: 13, cursor: "pointer",
          }}>{t.nav.logout}</button>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "100vh" }}>
        <div className="abs-sidebar" style={{ width: 220, background: INK_DARK, color: TEXT_ON_DARK, padding: "24px 16px", flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 19, marginBottom: 4, lineHeight: 1.25 }}>
            {profile?.studio_name || profile?.artist_name || t.appName}
          </div>
          <div style={{ fontSize: 11.5, color: TEXT_ON_DARK_MUTED, marginBottom: 26 }}>{t.tagline}</div>
          {NAV.map(([href, key]) => (
            <Link key={href} href={href} style={{
              display: "block", width: "100%", textAlign: "inherit", padding: "10px 14px", borderRadius: 8,
              background: pathname === href ? SIDEBAR_HOVER : "transparent",
              color: pathname === href ? TEXT_ON_DARK : TEXT_ON_DARK_MUTED, fontWeight: pathname === href ? 600 : 400,
              fontSize: 14.5, textDecoration: "none", marginBottom: 2,
            }}>{t.nav[key]}</Link>
          ))}
          <button onClick={() => setLanguage(lang === "ar" ? "en" : "ar")} style={{ marginTop: 20, background: "none", border: `1px solid ${BORDER_ON_DARK}`, borderRadius: 8, color: TEXT_ON_DARK_MUTED, padding: "8px 14px", fontSize: 13, cursor: "pointer", width: "100%" }}>{lang === "ar" ? "English" : "العربية"}</button>
          <button onClick={logout} style={{ marginTop: 8, background: "none", border: `1px solid ${BORDER_ON_DARK}`, borderRadius: 8, color: TEXT_ON_DARK_MUTED, padding: "8px 14px", fontSize: 13, cursor: "pointer", width: "100%" }}>{t.nav.logout}</button>
        </div>

        <div className="abs-main" style={{ flex: 1, padding: "28px 32px 90px", maxWidth: 1100 }}>
          {children}
        </div>
      </div>

      <div className="abs-bottomnav" style={{ display: "none" }}>
        {MOBILE_NAV.map(([href, key]) => (
          <Link key={href} href={href} style={{ color: pathname === href ? TEXT_ON_DARK : TEXT_ON_DARK_MUTED, fontWeight: pathname === href ? 700 : 400, fontSize: 11.5, textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 6px" }}>
            {t.nav[key]}
          </Link>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&family=Amiri:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: start; font-size: 12px; text-transform: uppercase; letter-spacing: .5px; color: #9C9280; padding: 8px 10px; border-bottom: 1px solid #EDE4D0; }
        td { padding: 10px; border-bottom: 1px solid #F2EBDA; font-size: 14px; }
        tr:hover td { background: #FBF7EF; } 
        @media print {
  body * { visibility: hidden; }
  .print-area, .print-area * { visibility: visible; }
  .print-area { position: absolute; top: 0; left: 0; width: 100%; padding: 20px; }
}
        @media (max-width: 860px) {
          .abs-sidebar { display: none; }
          .abs-topbar { display: flex !important; justify-content: space-between; align-items: center; background: ${INK_DARK}; padding: 14px 16px; position: sticky; top: 0; z-index: 30; }
          .abs-main { padding: 18px 16px 90px !important; }
          .abs-bottomnav { display: flex !important; position: fixed; bottom: 0; inset-inline: 0; background: ${INK_DARK}; z-index: 40; justify-content: space-around; padding: 8px 4px; }
        }
      `}</style>
    </div>
  );
}
