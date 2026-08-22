"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "./AppContext";

const INK_DARK = "#1E1A16";
const SIDEBAR_HOVER = "#2A241D";
const TEXT_ON_DARK = "#EDE7D9";
const TEXT_ON_DARK_MUTED = "#B5AC98";
const BORDER_ON_DARK = "#3A342B";

const NAV = [
  ["/dashboard", "dashboard"], ["/artworks", "artworks"], ["/pricing", "pricing"],
  ["/commissions", "commissions"], ["/clients", "clients"], ["/exhibitions", "exhibitions"],
  ["/sales", "sales"], ["/expenses", "expenses"], ["/contracts", "contracts"], ["/settings", "settings"],
];
const MOBILE_NAV = [["/dashboard", "dashboard"], ["/artworks", "artworks"], ["/sales", "sales"], ["/clients", "clients"], ["/more", "more"]];

export default function Shell({ children }) {
  const { t, lang, profile, logout, setLanguage } = useApp();
  const pathname = usePathname();
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir} style={{
      "--font-display": lang === "ar" ? "'Amiri', serif" : "'Playfair Display', serif",
      "--font-body": lang === "ar" ? "'IBM Plex Sans Arabic', sans-serif" : "'Inter', sans-serif",
      fontFamily: "var(--font-body)", minHeight: "100vh", color: "#241F1A", position: "relative",
    }}>
      <div aria-hidden="true" style={{
        position: "fixed", inset: 0, zIndex: -2,
        background: `
          radial-gradient(circle at 12% 18%, rgba(240,199,196,0.55) 0%, transparent 42%),
          radial-gradient(circle at 88% 12%, rgba(163,206,198,0.5) 0%, transparent 45%),
          radial-gradient(circle at 78% 78%, rgba(203,172,120,0.4) 0%, transparent 50%),
          radial-gradient(circle at 8% 85%, rgba(233,196,206,0.5) 0%, transparent 48%),
          radial-gradient(circle at 50% 45%, rgba(212,178,120,0.28) 0%, transparent 55%),
          linear-gradient(160deg, #FBF3EC 0%, #F6EFE4 35%, #EFF1EA 65%, #F8EFE9 100%)
        `,
      }} />
      <div aria-hidden="true" style={{
        position: "fixed", inset: 0, zIndex: -1,
        opacity: 0.5,
        backgroundImage: `
          linear-gradient(115deg, transparent 40%, rgba(196,155,74,0.10) 41%, rgba(196,155,74,0.10) 41.4%, transparent 42%),
          linear-gradient(25deg, transparent 60%, rgba(196,155,74,0.08) 61%, rgba(196,155,74,0.08) 61.3%, transparent 62%),
          linear-gradient(155deg, transparent 75%, rgba(196,155,74,0.09) 76%, rgba(196,155,74,0.09) 76.5%, transparent 77%)
        `,
      }} />

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

      <div className="abs-mobilenav" style={{ display: "none" }}>
        {MOBILE_NAV.map(([href, key]) => (
          <Link key={href} href={href} style={{ color: pathname === href ? TEXT_ON_DARK : TEXT_ON_DARK_MUTED, fontWeight: pathname === href ? 700 : 400, fontSize: 11.5, textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 6px" }}>
            {t.nav[key]}
          </Link>
        ))}
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Inter:wght@400;500;600;700&family=Amiri:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: start; font-size: 12px; text-transform: uppercase; letter-spacing: .5px; color: #9C9280; padding: 8px 10px; border-bottom: 1px solid #EDE4D0; }
        td { padding: 10px; border-bottom: 1px solid #F2EBDA; font-size: 14px; }
        tr:hover td { background: rgba(251,247,239,0.7); }
        @media print {
  body * { visibility: hidden; }
  .print-area, .print-area * { visibility: visible; }
  .print-area { position: absolute; top: 0; left: 0; width: 100%; padding: 20px; }
}
        @media (max-width: 860px) {
          .abs-sidebar { display: none; }
          .abs-topbar { display: flex !important; justify-content: space-between; align-items: center; background: ${INK_DARK}; padding: 14px 16px; position: sticky; top: 0; z-index: 30; }
          .abs-mobilenav { display: flex !important; background: ${INK_DARK}; position: sticky; top: 0; z-index: 29; justify-content: space-around; padding: 10px 4px; border-top: 1px solid ${BORDER_ON_DARK}; }
          .abs-main { padding: 18px 16px 30px !important; }
        }
      `}</style>
    </div>
  );
}
