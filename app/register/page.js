"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Field, Input, Select, Btn } from "../../components/ui";
import { DICT, CURRENCIES } from "../../lib/i18n";

export default function RegisterPage() {
  const router = useRouter();
  const [lang, setLang] = useState("en");
  const t = DICT[lang];
  const [form, setForm] = useState({ email: "", password: "", artistName: "", currency: "USD", hourlyRate: 15, margin: 60 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  function set(k, v) { setForm({ ...form, [k]: v }); }

  async function submit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (error) { setLoading(false); setError(error.message); return; }

    if (!data.session) {
      setLoading(false);
      setCheckEmail(true);
      return;
    }

    await supabase.from("profiles").update({
      artist_name: form.artistName, currency: form.currency, language: lang,
      default_hourly_rate: Number(form.hourlyRate) || 15, default_margin: Number(form.margin) || 60,
      onboarded: true,
    }).eq("id", data.user.id);

    setLoading(false);
    router.replace("/dashboard");
  }

  if (checkEmail) {
    return (
      <div style={{ minHeight: "100vh", background: "#2B2925", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: "#FBF8F1", borderRadius: 18, padding: 32, maxWidth: 380, textAlign: "center", fontFamily: "sans-serif", color: "#2B2925" }}>
          Check your email to confirm your account, then log in.
          <div style={{ marginTop: 16 }}><Link href="/login">Go to login →</Link></div>
        </div>
      </div>
    );
  }

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} style={{
      "--font-display": lang === "ar" ? "'Amiri', serif" : "'Fraunces', serif",
      "--font-body": lang === "ar" ? "'IBM Plex Sans Arabic', sans-serif" : "'Inter', sans-serif",
      minHeight: "100vh", background: "#2B2925", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "var(--font-body)",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&family=Amiri:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');`}</style>
      <form onSubmit={submit} style={{ background: "#FBF8F1", borderRadius: 18, padding: "36px 32px", maxWidth: 420, width: "100%" }}>
        <div style={{ textAlign: "end", marginBottom: 10 }}>
          <button type="button" onClick={() => setLang(lang === "ar" ? "en" : "ar")} style={{ background: "none", border: "1px solid #DDD6C4", borderRadius: 6, padding: "4px 10px", fontSize: 12.5, cursor: "pointer", color: "#6B655A" }}>
            {lang === "ar" ? "English" : "العربية"}
          </button>
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 24, marginBottom: 4 }}>{t.appName}</div>
        <div style={{ color: "#8A8371", fontSize: 13.5, marginBottom: 22 }}>{t.auth.createStudio}</div>

        <Field label={t.auth.email}><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required /></Field>
        <Field label={t.auth.password}><Input type="password" minLength={6} value={form.password} onChange={(e) => set("password", e.target.value)} required /></Field>
        <Field label={t.onboarding.artistName}><Input value={form.artistName} onChange={(e) => set("artistName", e.target.value)} /></Field>
        <Field label={t.onboarding.currency}>
          <Select value={form.currency} onChange={(e) => set("currency", e.target.value)}>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
          <Field label={t.onboarding.hourlyRate}><Input type="number" value={form.hourlyRate} onChange={(e) => set("hourlyRate", e.target.value)} /></Field>
          <Field label={t.onboarding.margin}><Input type="number" value={form.margin} onChange={(e) => set("margin", e.target.value)} /></Field>
        </div>
        {error && <div style={{ color: "#9A4A3E", fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <Btn type="submit" disabled={loading} style={{ width: "100%" }}>{t.onboarding.create}</Btn>
        <div style={{ marginTop: 16, fontSize: 13.5, textAlign: "center", color: "#6B655A" }}>
          {t.auth.haveAccount} <Link href="/login" style={{ color: "#B08D57", fontWeight: 600 }}>{t.auth.login}</Link>
        </div>
      </form>
    </div>
  );
}
