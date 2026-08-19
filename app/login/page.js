"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Field, Input, Btn } from "../../components/ui";
import { DICT } from "../../lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState("en");
  const t = DICT[lang];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else router.replace("/dashboard");
  }

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} style={{
      "--font-display": lang === "ar" ? "'Amiri', serif" : "'Fraunces', serif",
      "--font-body": lang === "ar" ? "'IBM Plex Sans Arabic', sans-serif" : "'Inter', sans-serif",
      minHeight: "100vh", background: "#2B2925", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "var(--font-body)",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&family=Amiri:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');`}</style>
      <form onSubmit={submit} style={{ background: "#FBF8F1", borderRadius: 18, padding: "36px 32px", maxWidth: 400, width: "100%" }}>
        <div style={{ textAlign: "end", marginBottom: 10 }}>
          <button type="button" onClick={() => setLang(lang === "ar" ? "en" : "ar")} style={{ background: "none", border: "1px solid #DDD6C4", borderRadius: 6, padding: "4px 10px", fontSize: 12.5, cursor: "pointer", color: "#6B655A" }}>
            {lang === "ar" ? "English" : "العربية"}
          </button>
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 24, marginBottom: 4 }}>{t.appName}</div>
        <div style={{ color: "#8A8371", fontSize: 13.5, marginBottom: 22 }}>{t.auth.welcomeBack}</div>
        <Field label={t.auth.email}><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
        <Field label={t.auth.password}><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Field>
        {error && <div style={{ color: "#9A4A3E", fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <Btn type="submit" disabled={loading} style={{ width: "100%" }}>{t.auth.login}</Btn>
        <div style={{ marginTop: 16, fontSize: 13.5, textAlign: "center", color: "#6B655A" }}>
          {t.auth.noAccount} <Link href="/register" style={{ color: "#B08D57", fontWeight: 600 }}>{t.auth.register}</Link>
        </div>
      </form>
    </div>
  );
}
