"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Smartphone, Palette } from "lucide-react";
import { FaCcVisa, FaCcMastercard, FaCcPaypal } from "react-icons/fa";
import { supabase } from "../../../lib/supabaseClient";
import { Card, Modal } from "../../../components/ui";
import { money } from "../../../lib/helpers";
import { DICT, PAYMENT_METHOD_KEYS } from "../../../lib/i18n";

const GOLD = "#4A7C59";
const GOLD_DEEP = "#3D6B4A";
const INK = "#241F1A";
const TEXT_SECONDARY = "#6B6155";
const TEXT_MUTED = "#9C9280";
const BORDER = "#EDE4D0";

const PORTAL_TEXT = {
  ar: {
    gallery: "المعرض الفني", subtitle: "تصفح الأعمال المتاحة حالياً", empty: "لا توجد أعمال متاحة للبيع حالياً. تواصلوا معنا لمزيد من المعلومات.", price: "السعر",
    paymentTitle: "طرق الدفع المقبولة (دوس للتفاصيل)", notFound: "لم يتم العثور على هذا المعرض.",
    payTo: "الدفع إلى", name: "الاسم الكامل", phone: "رقم الهاتف", contactNote: "ملاحظة (اختياري)", contactNotePlaceholder: "مثلا: العمل الفني اللي معجبني، أو أي تفاصيل...",
    transferRef: "رقم/مرجع التحويل", transferRefPlaceholder: "اكتب مرجع العملية بعد التحويل",
    submitContact: "إرسال طلب التواصل", submitTransfer: "تأكيد التحويل", sending: "جارِ الإرسال…",
    successContact: "تم إرسال طلبك، سيتواصل معك الفنان قريباً.", successTransfer: "تم إرسال تأكيد التحويل، سيتم مراجعته قريباً.",
    close: "إغلاق", requiredFields: "الاسم والهاتف مطلوبان.",
    requestPortrait: "طلب عمل بورتري", portraitType: "نوع العمل", size: "المقاس المطلوب (اختياري)",
    pencil: "قلم رصاص", oil: "زيتي", acrylic: "أكريليك",
    portraitNote: "تفاصيل إضافية (اختياري)", portraitNotePlaceholder: "مثلا: عدد الأشخاص في الصورة، المناسبة...",
    submitPortrait: "إرسال طلب العمل", successPortrait: "تم إرسال طلبك بنجاح! سيتواصل معك الفنان لتأكيد التفاصيل والسعر.",
  },
  en: {
    gallery: "Art Gallery", subtitle: "Browse currently available artworks", empty: "No artworks are available for sale right now. Get in touch for more information.", price: "Price",
    paymentTitle: "Accepted payment methods (tap for details)", notFound: "This gallery could not be found.",
    payTo: "Pay to", name: "Full name", phone: "Phone number", contactNote: "Note (optional)", contactNotePlaceholder: "e.g. which artwork you're interested in, or any details...",
    transferRef: "Transfer reference number", transferRefPlaceholder: "Enter the transaction reference after transferring",
    submitContact: "Send contact request", submitTransfer: "Confirm transfer", sending: "Sending…",
    successContact: "Your request has been sent, the artist will contact you soon.", successTransfer: "Your transfer confirmation has been sent for review.",
    close: "Close", requiredFields: "Name and phone are required.",
    requestPortrait: "Request a Portrait", portraitType: "Portrait type", size: "Desired size (optional)",
    pencil: "Pencil", oil: "Oil", acrylic: "Acrylic",
    portraitNote: "Additional details (optional)", portraitNotePlaceholder: "e.g. number of people in the photo, occasion...",
    submitPortrait: "Send request", successPortrait: "Your request has been sent! The artist will contact you to confirm details and price.",
  },
};

function PaymentBadge({ children, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 64,
      background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit",
    }}>
      <div style={{
        width: 54, height: 38, borderRadius: 8, background: "#FFFDF9", border: `1px solid ${BORDER}`,
        display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(61,107,74,0.08)",
        transition: "transform 0.15s ease",
      }}>
        {children}
      </div>
      <span style={{ fontSize: 11, color: TEXT_SECONDARY }}>{label}</span>
    </button>
  );
}

export default function PublicGalleryPage() {
  const { artistId } = useParams();
  const [profile, setProfile] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("ar");
  const [paymentModal, setPaymentModal] = useState(null);
  const [portraitModal, setPortraitModal] = useState(false);

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
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          {profile && (
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, color: GOLD_DEEP, marginBottom: 6 }}>
              {profile.studio_name || profile.artist_name}
            </div>
          )}
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, color: INK, margin: "0 0 10px", position: "relative", display: "inline-block", paddingBottom: 12 }}>
            {p.gallery}
            <span style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 60, height: 2.5, backgroundImage: `linear-gradient(to right, ${GOLD_DEEP}, ${GOLD})`, borderRadius: 2 }} />
          </h1>
          <div style={{ fontSize: 14.5, color: TEXT_SECONDARY, marginBottom: 20 }}>{p.subtitle}</div>

          {profile && (
            <button onClick={() => setPortraitModal(true)} style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 24,
              border: "none", background: GOLD, color: "#FFFDF9", fontSize: 14.5, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(61,107,74,0.25)",
            }}>
              <Palette size={17} strokeWidth={2} />
              {p.requestPortrait}
            </button>
          )}
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
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 16, color: INK }}>{p.paymentTitle}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              <PaymentBadge label={t.paymentMethod.visa} onClick={() => setPaymentModal("visa")}>
                <FaCcVisa size={30} color="#1A1F71" />
              </PaymentBadge>
              <PaymentBadge label={t.paymentMethod.mastercard} onClick={() => setPaymentModal("mastercard")}>
                <FaCcMastercard size={30} color="#EB001B" />
              </PaymentBadge>
              <PaymentBadge label={t.paymentMethod.paypal} onClick={() => setPaymentModal("paypal")}>
                <FaCcPaypal size={30} color="#003087" />
              </PaymentBadge>
              <PaymentBadge label={t.paymentMethod.baridimob} onClick={() => setPaymentModal("baridimob")}>
                <Smartphone size={20} color="#2E7D32" strokeWidth={1.8} />
              </PaymentBadge>
            </div>
          </Card>
        )}

        {paymentModal && (
          <PaymentRequestModal
            method={paymentModal} methodLabel={t.paymentMethod[paymentModal]}
            payToInfo={profile?.payment_info?.[paymentModal]}
            artistId={artistId} lang={lang} p={p}
            onClose={() => setPaymentModal(null)}
          />
        )}

        {portraitModal && (
          <PortraitRequestModal
            artistId={artistId} lang={lang} p={p}
            onClose={() => setPortraitModal(false)}
          />
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

function PortraitRequestModal({ artistId, lang, p, onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [portraitType, setPortraitType] = useState("pencil");
  const [size, setSize] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!name.trim() || !phone.trim()) { setError(p.requiredFields); return; }
    setError("");
    setSending(true);
    const { error: err } = await supabase.from("portal_requests").insert({
      user_id: artistId, method: "portrait", request_type: "portrait_request",
      portrait_type: portraitType, size: size.trim() || null,
      client_name: name.trim(), client_phone: phone.trim(), message: note.trim() || null,
    });
    setSending(false);
    if (err) { setError(err.message); return; }
    setDone(true);
  }

  const TYPES = [
    { key: "pencil", label: p.pencil },
    { key: "oil", label: p.oil },
    { key: "acrylic", label: p.acrylic },
  ];

  return (
    <Modal title={p.requestPortrait} onClose={onClose}>
      {done ? (
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div style={{ fontSize: 14.5, color: INK, marginBottom: 18 }}>{p.successPortrait}</div>
          <button onClick={onClose} style={{
            padding: "9px 20px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "#FFFDF9",
            fontSize: 13.5, fontWeight: 600, cursor: "pointer", color: INK,
          }}>{p.close}</button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12.5, color: TEXT_SECONDARY, marginBottom: 8, fontWeight: 600 }}>{p.portraitType}</label>
            <div style={{ display: "flex", gap: 8 }}>
              {TYPES.map((tp) => (
                <button key={tp.key} onClick={() => setPortraitType(tp.key)} style={{
                  flex: 1, padding: "10px 8px", borderRadius: 9, cursor: "pointer", fontFamily: "inherit",
                  border: portraitType === tp.key ? `2px solid ${GOLD}` : `1px solid ${BORDER}`,
                  background: portraitType === tp.key ? "rgba(74,124,89,0.1)" : "#FFFDF9",
                  color: portraitType === tp.key ? GOLD_DEEP : INK, fontSize: 13, fontWeight: 600,
                }}>{tp.label}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12.5, color: TEXT_SECONDARY, marginBottom: 5, fontWeight: 600 }}>{p.name}</label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={{
              width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "#FFFDF9",
              fontSize: 14.5, color: INK, fontFamily: "inherit", boxSizing: "border-box",
            }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12.5, color: TEXT_SECONDARY, marginBottom: 5, fontWeight: 600 }}>{p.phone}</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" style={{
              width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "#FFFDF9",
              fontSize: 14.5, color: INK, fontFamily: "inherit", boxSizing: "border-box",
            }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12.5, color: TEXT_SECONDARY, marginBottom: 5, fontWeight: 600 }}>{p.size}</label>
            <input value={size} onChange={(e) => setSize(e.target.value)} style={{
              width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "#FFFDF9",
              fontSize: 14.5, color: INK, fontFamily: "inherit", boxSizing: "border-box",
            }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12.5, color: TEXT_SECONDARY, marginBottom: 5, fontWeight: 600 }}>{p.portraitNote}</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={p.portraitNotePlaceholder} style={{
              width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "#FFFDF9",
              fontSize: 14.5, color: INK, fontFamily: "inherit", boxSizing: "border-box", minHeight: 70, resize: "vertical",
            }} />
          </div>
          {error && <div style={{ color: "#9A4A3E", fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <button onClick={submit} disabled={sending} style={{
            width: "100%", padding: "11px 18px", borderRadius: 8, border: "none", background: GOLD,
            color: "#FFFDF9", fontSize: 14.5, fontWeight: 700, cursor: sending ? "default" : "pointer", opacity: sending ? 0.7 : 1,
          }}>
            {sending ? p.sending : p.submitPortrait}
          </button>
        </>
      )}
    </Modal>
  );
}

function PaymentRequestModal({ method, methodLabel, payToInfo, artistId, lang, p, onClose }) {
  const isTransfer = method === "baridimob" || method === "paypal";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!name.trim() || !phone.trim()) { setError(p.requiredFields); return; }
    setError("");
    setSending(true);
    const { error: err } = await supabase.from("portal_requests").insert({
      user_id: artistId, method, request_type: "payment", client_name: name.trim(), client_phone: phone.trim(), message: note.trim() || null,
    });
    setSending(false);
    if (err) { setError(err.message); return; }
    setDone(true);
  }

  return (
    <Modal title={methodLabel} onClose={onClose}>
      {done ? (
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div style={{ fontSize: 14.5, color: INK, marginBottom: 18 }}>
            {isTransfer ? p.successTransfer : p.successContact}
          </div>
          <button onClick={onClose} style={{
            padding: "9px 20px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "#FFFDF9",
            fontSize: 13.5, fontWeight: 600, cursor: "pointer", color: INK,
          }}>{p.close}</button>
        </div>
      ) : (
        <>
          {isTransfer && payToInfo && (
            <div style={{ background: "rgba(74,124,89,0.1)", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: GOLD_DEEP, marginBottom: 4 }}>{p.payTo}</div>
              <div style={{ fontSize: 14, color: INK, whiteSpace: "pre-wrap" }}>{payToInfo}</div>
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12.5, color: TEXT_SECONDARY, marginBottom: 5, fontWeight: 600 }}>{p.name}</label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={{
              width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "#FFFDF9",
              fontSize: 14.5, color: INK, fontFamily: "inherit", boxSizing: "border-box",
            }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12.5, color: TEXT_SECONDARY, marginBottom: 5, fontWeight: 600 }}>{p.phone}</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" style={{
              width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "#FFFDF9",
              fontSize: 14.5, color: INK, fontFamily: "inherit", boxSizing: "border-box",
            }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12.5, color: TEXT_SECONDARY, marginBottom: 5, fontWeight: 600 }}>
              {isTransfer ? p.transferRef : p.contactNote}
            </label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)}
              placeholder={isTransfer ? p.transferRefPlaceholder : p.contactNotePlaceholder}
              style={{
                width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "#FFFDF9",
                fontSize: 14.5, color: INK, fontFamily: "inherit", boxSizing: "border-box", minHeight: 70, resize: "vertical",
              }} />
          </div>
          {error && <div style={{ color: "#9A4A3E", fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <button onClick={submit} disabled={sending} style={{
            width: "100%", padding: "11px 18px", borderRadius: 8, border: "none", background: GOLD,
            color: "#FFFDF9", fontSize: 14.5, fontWeight: 700, cursor: sending ? "default" : "pointer", opacity: sending ? 0.7 : 1,
          }}>
            {sending ? p.sending : (isTransfer ? p.submitTransfer : p.submitContact)}
          </button>
        </>
      )}
    </Modal>
  );
}
