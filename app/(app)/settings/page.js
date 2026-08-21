"use client";
import React, { useState } from "react";
import { useApp } from "../../../components/AppContext";
import { supabase } from "../../../lib/supabaseClient";
import { SectionTitle, Card, Field, Input, Select, Btn } from "../../../components/ui";
import { CURRENCIES } from "../../../lib/i18n";

export default function SettingsPage() {
  const { t, lang, profile, refreshProfile, session } = useApp();
  const s = t.settings;
  const [form, setForm] = useState({
    artist_name: profile.artist_name || "", studio_name: profile.studio_name || "",
    currency: profile.currency, language: profile.language,
    default_hourly_rate: profile.default_hourly_rate, default_margin: profile.default_margin,
    default_gallery_commission: profile.default_gallery_commission,
  });
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  function set(k, v) { setForm({ ...form, [k]: v }); }

  async function save() {
    await supabase.from("profiles").update(form).eq("id", session.user.id);
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
        <Btn onClick={save}>{s.save}</Btn>
        {saved && <span style={{ marginInlineStart: 12, fontSize: 13, color: "#5F8A5F" }}>{s.saved}</span>}
      </Card>

      <Card style={{ maxWidth: 520 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>{lang === "ar" ? "بوابة العميل العامة" : "Public client portal"}</div>
        <div style={{ fontSize: 13, color: "#9C9280", marginBottom: 14 }}>
          {lang === "ar"
