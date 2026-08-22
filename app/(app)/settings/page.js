"use client";
import React, { useState } from "react";
import { useApp } from "../../../components/AppContext";
import { supabase } from "../../../lib/supabaseClient";
import { SectionTitle, Card, Field, Input, Select, TextArea, Btn } from "../../../components/ui";
import { CURRENCIES, PAYMENT_METHOD_KEYS } from "../../../lib/i18n";

export default function SettingsPage() {
  const { t, lang, profile, refreshProfile, session } = useApp();
  const s = t.settings;
  const [form, setForm] = useState({
    artist_name: profile.artist_name || "", studio_name: profile.studio_name || "",
    currency: profile.currency, language: profile.language,
    default_hourly_rate: profile.default_hourly_rate, default_margin: profile.default_margin,
    default_gallery_commission: profile.default_gallery_commission,
  });
  const [paymentInfo, setPaymentInfo] = useState(profile.payment_info || {});
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  function set(k, v) { setForm({ ...form, [k]: v }); }
  function setPayment(k, v) { setPaymentInfo({ ...paymentInfo, [k]: v }); }

  async function save() {
    await supabase.from("profiles").update({ ...form, payment_info: paymentInfo }).eq("id", session.user.id);
    await refreshProfile();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const portalLink = typeof window !== "undefined" ? `${window.location.origin}/gallery/${session.user.id}` : "";

  function copyLink() {
    navigator.clipboard.writeText(portalLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const PAYMENT_PLACEHOLDERS = {
    visa: lang === "ar" ? "مثال: تواصلوا معنا لترتيب الدفع بالبطاقة، أو رابط دفع" : "e.g. Contact us to arrange card payment, or a payment link",
    mastercard: lang === "ar" ? "مثال: تواصلوا معنا لترتيب الدفع بالبطاقة، أو رابط دفع" : "e.g. Contact us to arrange card payment, or a payment link",
    paypal: lang === "ar" ? "البريد الإلكتروني أو رابط PayPal.me" : "Your email or PayPal.me link",
    baridimob: lang === "ar" ? "رقم الهاتف المرتبط بـ BaridiMob" : "Phone number linked to BaridiMob",
  };

  return (
    <div>
      <SectionTitle>{s.title}</SectionTitle>
      <Card style={{ maxWidth: 520, marginBottom: 18 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>{s.profile}</div>
        <Field label={s.artistName}><Input value={form.artist_name} onChange={(e) => set("artist_name", e.target.value)} /></Field>
        <Field label={s.studioName}><Input value={form.studio_name} onChange={(e) => set("studio_name", e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label={s.currency}><Select value={form.currency} onChange={(e) => set("currency", e.target.value)}>{CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}</Select></Field>
          <Field label={s.language}><Select value={form.language} onChange={(e) => set("language", e.target.value)}><option value="en">English</option><option value="ar">العربية</option></Select></Field>
        </div>
      </Card>
      <Card style={{ maxWidth: 520, marginBottom: 18 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>{s.defaults}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label={s.defaultHourlyRate}><Input type="number" value={form.default_hourly_rate} onChange={(e) => set("default_hourly_rate", e.target.value)} /></Field>
          <Field label={s.defaultMargin}><Input type="number" value={form.default_margin} onChange={(e) => set("default_margin", e.target.value)} /></Field>
          <Field label={s.defaultGalleryCommission}><Input type="number" value={form.default_gallery_commission} onChange={(e) => set("default_gallery_commission", e.target.value)} /></Field>
        </div>
      </Card>

      <Card style={{ maxWidth: 520, marginBottom: 18 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>{lang === "ar" ? "تفاصيل طرق الدفع" : "Payment method details"}</div>
        <div style={{ fontSize: 12.5, color: "#9C9280", marginBottom: 14 }}>
          {lang === "ar"
            ? "هذي التفاصيل تبان للعميل كي يدوس على أيقونة طريقة الدفع فبوابتك العامة."
            : "These details are shown to clients when they tap a payment method icon on your public portal."}
        </div>
        {PAYMENT_METHOD_KEYS.filter((k) => k !== "cash").map((k) => (
          <Field key={k} label={t.paymentMethod[k]}>
            <TextArea value={paymentInfo[k] || ""} onChange={(e) => setPayment(k, e.target.value)} placeholder={PAYMENT_PLACEHOLDERS[k]} style={{ minHeight: 50 }} />
          </Field>
        ))}
      </Card>

      <Card style={{ maxWidth: 520, marginBottom: 18 }}>
        <Btn onClick={save}>{s.save}</Btn>
        {saved && <span style={{ marginInlineStart: 12, fontSize: 13, color: "#5F8A5F" }}>{s.saved}</span>}
      </Card>

      <Card style={{ maxWidth: 520 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>{lang === "ar" ? "بوابة العميل العامة" : "Public client portal"}</div>
        <div style={{ fontSize: 13, color: "#9C9280", marginBottom: 14 }}>
          {lang === "ar"
            ? "شارك هذا الرابط مع عملائك ليتصفحوا أعمالك المتاحة وأسعارها وطرق الدفع."
            : "Share this link with your clients so they can browse your available artworks, prices, and payment methods."}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Input value={portalLink} readOnly style={{ flex: "1 1 220px" }} />
          <Btn variant="ghost" onClick={copyLink}>{copied ? (lang === "ar" ? "تم النسخ ✓" : "Copied ✓") : (lang === "ar" ? "نسخ الرابط" : "Copy link")}</Btn>
          <a href={portalLink} target="_blank" rel="noreferrer"><Btn variant="ghost">{lang === "ar" ? "فتح" : "Open"}</Btn></a>
        </div>
      </Card>
    </div>
  );
}
