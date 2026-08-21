"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CreditCard, Wallet, Smartphone, Landmark } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { Card } from "../../../components/ui";
import { money } from "../../../lib/helpers";
import { DICT, PAYMENT_METHOD_KEYS } from "../../../lib/i18n";

const GOLD = "#A47C3E";
const GOLD_DEEP = "#8C6530";
const INK = "#241F1A";
const TEXT_SECONDARY = "#6B6155";
const TEXT_MUTED = "#9C9280";
const BORDER = "#EDE4D0";

const PAYMENT_ICONS = { visa: CreditCard, mastercard: CreditCard, paypal: Wallet, baridimob: Smartphone, cash: Landmark };

const PORTAL_TEXT = {
  ar: { gallery: "المعرض الفني", subtitle: "تصفح الأعمال المتاحة حالياً", empty: "لا توجد أعمال متاحة للبيع حالياً. تواصلوا معنا لمزيد من المعلومات.", price: "السعر", paymentTitle: "طرق الدفع المتاحة", notFound: "لم يتم العثور على هذا المعرض." },
  en: { gallery: "Art Gallery", subtitle: "Browse currently available artworks", empty: "No artworks are available for sale right now. Get in touch for more information.", price: "Price", paymentTitle: "Accepted payment methods", notFound: "This gallery could not be found." },
};

export default function PublicGalleryPage() {
  const { artistId } = useParams();
  const [profile, setProfile] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("ar");

  useEffect(() => {
    async function load() {
      const [{ data: prof }, { data: works }] = await Promise.all([
        supabase.from("public_profiles").select("*").eq("id", artistId).single(),
        supabase.from("public_artworks").select("*").eq("user_id", artistId).order("id", { ascending: false }),
      ]);
      setProfile(prof || null);
      setArtworks(works || []);
      setLang(prof?.language || "ar");
      setLoading(false);
    }
    if (artistId) load();
  }, [artistId]);

  const p = PORTAL_TEXT[lang];
  const t = DICT[lang];
  const currency = profile?.currency || "USD";
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir} style={{
      "--font-display": lang === "ar" ? "'Amiri', serif" : "'Playfair Display', serif",
      "--font-body": lang === "ar" ? "'IBM Plex Sans Arabic', sans-serif" : "'Inter', sans-serif",
      fontFamily: "var(--font-body)", minHeight: "100vh", color: INK, position: "relative",
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

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 20px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 34 }}>
          {profile && (
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, color: GOLD_DEEP, marginBottom: 6 }}>
              {profile.studio_name || profile.artist_name}
            </div>
          )}
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, color: INK, margin: "0 0 10px", position: "relative", display: "inline-block", paddingBottom: 12 }}>
            {p.gallery}
            <span style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 60, height: 2.5, backgroundImage: `linear-gradient(to right, ${GOLD_DEEP}, ${GOLD})`, borderRadius: 2 }} />
          </h1>
          <div style={{ fontSize: 14.5, color: TEXT_SECONDARY }}>{p.subtitle}</div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: TEXT_MUTED, padding: 60 }}>…</div>
        ) : !profile ? (
          <div style={{ textAlign: "center", color: TEXT_MUTED, padding: 60 }}>{p.notFound}</div>
        ) : artworks.length === 0 ? (
          <div style={{ textAlign: "center", color: TEXT_MUTED, padding: 60, fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 17 }}>{p.empty}</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
            {artworks.map((a) => (
              <Card key={a.id} style={{ padding: 0, overflow: "hidden" }}>
                <div style={{
                  height: 180, background: a.image ? `url(${a.image}) center/cover` : "#EFE9DA",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#B0A98F", fontFamily: "var(--font-display)", fontStyle: "italic",
                }}>
                  {!a.image && a.title}
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 17, marginBottom: 4, color: INK }}>{a.title}</div>
                  <div style={{ fontSize: 12.5, color: TEXT_MUTED, marginBottom: 10 }}>
                    {a.medium}{a.year ? `, ${a.year}` : ""}{a.width && a.height ? ` — ${a.width}×${a.height} ${a.unit}` : ""}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${BORDER}`, paddingTop: 10 }}>
                    <span style={{ fontSize: 12.5, color: TEXT_SECONDARY }}>{p.price}</span>
                    <span style={{ fontWeight: 700, fontSize: 15, color: GOLD_DEEP }}>
                      {a.suggested_price ? money(a.suggested_price, currency, lang) : "—"}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {profile && (
          <Card style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 14, color: INK }}>{p.paymentTitle}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap" }}>
              {PAYMENT_METHOD_KEYS.filter((k) => k !== "cash").map((k) => {
                const Icon = PAYMENT_ICONS[k];
                return (
                  <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 64 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(164,124,62,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={18} color={GOLD_DEEP} strokeWidth={1.8} />
                    </div>
                    <span style={{ fontSize: 11.5, color: TEXT_SECONDARY }}>{t.paymentMethod[k]}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Inter:wght@400;500;600;700&family=Amiri:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>
    </div>
  );
}
