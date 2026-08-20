"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useApp } from "../../../../components/AppContext";
import { supabase } from "../../../../lib/supabaseClient";
import { money } from "../../../../lib/helpers";
import { CONTRACT_DOC_TITLES } from "../../../../lib/i18n";

export default function ContractDocPage() {
  const { id } = useParams();
  const { t, lang, currency, profile, session } = useApp();
  const c = t.contracts;
  const [contract, setContract] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const uid = session.user.id;
      const { data: ctr } = await supabase.from("contracts").select("*").eq("id", id).eq("user_id", uid).single();
      setContract(ctr);
      if (ctr?.client_id) {
        const { data: cl } = await supabase.from("clients").select("*").eq("id", ctr.client_id).single();
        setClient(cl);
      }
      setLoading(false);
    }
    load();
  }, [id, session]);

  if (loading) return <div style={{ color: "#8A8371" }}>Loading…</div>;
  if (!contract) return <div style={{ color: "#8A8371" }}>{c.notFound}</div>;

  const partyType = client?.type || "client";
  const docTitle = (CONTRACT_DOC_TITLES[lang] || CONTRACT_DOC_TITLES.en)[partyType] || (CONTRACT_DOC_TITLES.en)[partyType];
  const partyLabel = t.clientType[partyType] || t.clientType.client;
  const remaining = Number(contract.price || 0) - Number(contract.deposit || 0);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir}>
      <button className="no-print" onClick={() => window.print()} style={{ marginBottom: 20, background: "#A47C3E", color: "#FFFDF9", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{c.view}</button>

      <div className="print-area" style={{ background: "#FFFDF9", border: "1px solid #EDE4D0", borderRadius: 14, padding: "40px 36px", maxWidth: 720, margin: "0 auto", fontFamily: "var(--font-body)", color: "#241F1A" }}>
        <div style={{ textAlign: "center", marginBottom: 28, borderBottom: "2px solid #A47C3E", paddingBottom: 18 }}>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, color: "#9C9280", marginBottom: 6 }}>
            {profile?.studio_name || profile?.artist_name}
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, margin: 0 }}>{docTitle}</h1>
          <div style={{ fontSize: 12.5, color: "#9C9280", marginTop: 8 }}>{c.agreementNo}: {contract.id.slice(0, 8).toUpperCase()} · {c.date}: {new Date(contract.created_at).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, color: "#9C9280", marginBottom: 4 }}>{c.artist}</div>
            <div style={{ fontWeight: 600 }}>{profile?.artist_name || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, color: "#9C9280", marginBottom: 4 }}>{partyLabel}</div>
            <div style={{ fontWeight: 600 }}>{client?.name || "—"}</div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, borderBottom: "1px solid #EDE4D0", paddingBottom: 6 }}>{c.subject}</div>
          <table style={{ width: "100%", fontSize: 14 }}>
            <tbody>
              <tr><td style={{ padding: "5px 0", color: "#6B6155", width: "35%" }}>{c.subject}</td><td style={{ padding: "5px 0" }}>{contract.subject}</td></tr>
              <tr><td style={{ padding: "5px 0", color: "#6B6155" }}>{c.size}</td><td style={{ padding: "5px 0" }}>{contract.size || "—"}</td></tr>
              <tr><td style={{ padding: "5px 0", color: "#6B6155" }}>{c.medium}</td><td style={{ padding: "5px 0" }}>{contract.medium || "—"}</td></tr>
              <tr><td style={{ padding: "5px 0", color: "#6B6155" }}>{c.deadline}</td><td style={{ padding: "5px 0" }}>{contract.deadline || "—"}</td></tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, borderBottom: "1px solid #EDE4D0", paddingBottom: 6 }}>{c.price}</div>
          <table style={{ width: "100%", fontSize: 14 }}>
            <tbody>
              <tr><td style={{ padding: "5px 0", color: "#6B6155" }}>{c.price}</td><td style={{ padding: "5px 0", fontWeight: 600 }}>{money(contract.price, currency, lang)}</td></tr>
              <tr><td style={{ padding: "5px 0", color: "#6B6155" }}>{c.deposit}</td><td style={{ padding: "5px 0", fontWeight: 600, color: "#5F7A54" }}>{money(contract.deposit, currency, lang)}</td></tr>
              <tr><td style={{ padding: "5px 0", color: "#6B6155" }}>{c.remaining}</td><td style={{ padding: "5px 0", fontWeight: 700 }}>{money(remaining, currency, lang)}</td></tr>
            </tbody>
          </table>
          <div style={{ fontSize: 12.5, color: "#9C9280", marginTop: 8 }}>{c.remainingNote}</div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, borderBottom: "1px solid #EDE4D0", paddingBottom: 6 }}>{c.terms}</div>
          <ul style={{ margin: 0, paddingInlineStart: 20, fontSize: 13, color: "#3A342B", lineHeight: 1.8 }}>
            {(contract.terms || "").split("\n").filter(Boolean).map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 50 }}>
          <div><div style={{ borderTop: "1px solid #241F1A", paddingTop: 8, fontSize: 12.5, color: "#6B6155" }}>{c.signArtist}</div></div>
          <div><div style={{ borderTop: "1px solid #241F1A", paddingTop: 8, fontSize: 12.5, color: "#6B6155" }}>{c.signParty}</div></div>
        </div>
      </div>
    </div>
  );
}
