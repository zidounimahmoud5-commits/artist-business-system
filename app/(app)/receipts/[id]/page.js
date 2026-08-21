"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useApp } from "../../../../components/AppContext";
import { supabase } from "../../../../lib/supabaseClient";
import { money } from "../../../../lib/helpers";

export default function ReceiptPage() {
  const { id } = useParams();
  const { t, lang, currency, profile, session } = useApp();
  const r = t.receipts;
  const [commission, setCommission] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const uid = session.user.id;
      const { data: cm } = await supabase.from("commissions").select("*").eq("id", id).eq("user_id", uid).single();
      setCommission(cm);
      if (cm?.client_id) {
        const { data: cl } = await supabase.from("clients").select("*").eq("id", cm.client_id).single();
        setClient(cl);
      }
      setLoading(false);
    }
    load();
  }, [id, session]);

  if (loading) return <div style={{ color: "#8A8371" }}>Loading…</div>;
  if (!commission) return <div style={{ color: "#8A8371" }}>{r.notFound}</div>;

  const price = Number(commission.price || 0);
  const deposit = Number(commission.deposit || 0);
  const remaining = price - deposit;
  const paidInFull = remaining <= 0;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir}>
      <button className="no-print" onClick={() => window.print()} style={{ marginBottom: 20, background: "#A47C3E", color: "#FFFDF9", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{r.view}</button>

      <div className="print-area" style={{ background: "#FFFDF9", border: "1px solid #EDE4D0", borderRadius: 14, padding: "40px 36px", maxWidth: 640, margin: "0 auto", fontFamily: "var(--font-body)", color: "#241F1A" }}>
        <div style={{ textAlign: "center", marginBottom: 28, borderBottom: "2px solid #A47C3E", paddingBottom: 18 }}>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, color: "#9C9280", marginBottom: 6 }}>
            {profile?.studio_name || profile?.artist_name}
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, margin: 0 }}>{r.title}</h1>
          <div style={{ fontSize: 12.5, color: "#9C9280", marginTop: 8 }}>{r.receiptNo}: {commission.id.slice(0, 8).toUpperCase()} · {r.date}: {new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, color: "#9C9280", marginBottom: 4 }}>{r.client}</div>
            <div style={{ fontWeight: 600 }}>{client?.name || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, color: "#9C9280", marginBottom: 4 }}>{r.item}</div>
            <div style={{ fontWeight: 600 }}>{commission.title || commission.concept || "—"}</div>
          </div>
        </div>

        <table style={{ width: "100%", fontSize: 14, marginBottom: 8 }}>
          <tbody>
            <tr><td style={{ padding: "7px 0", color: "#6B6155" }}>{r.totalPrice}</td><td style={{ padding: "7px 0", fontWeight: 600, textAlign: "end" }}>{money(price, currency, lang)}</td></tr>
            <tr><td style={{ padding: "7px 0", color: "#6B6155" }}>{r.deposit}</td><td style={{ padding: "7px 0", fontWeight: 600, color: "#5F7A54", textAlign: "end" }}>{money(deposit, currency, lang)}</td></tr>
            <tr><td style={{ padding: "7px 0", color: "#6B6155" }}>{r.paymentMethod}</td><td style={{ padding: "7px 0", textAlign: "end" }}>{t.paymentMethod[commission.payment_method] || "—"}</td></tr>
            <tr style={{ borderTop: "1px solid #EDE4D0" }}>
              <td style={{ padding: "10px 0 0", fontWeight: 700 }}>{r.remaining}</td>
              <td style={{ padding: "10px 0 0", fontWeight: 700, textAlign: "end", color: paidInFull ? "#5F7A54" : "#9A4A3E" }}>
                {paidInFull ? r.paidInFull : money(remaining, currency, lang)}
              </td>
            </tr>
          </tbody>
        </table>
        {!paidInFull && <div style={{ fontSize: 12.5, color: "#9C9280", marginBottom: 24 }}>{r.remainingNote}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 50 }}>
          <div><div style={{ borderTop: "1px solid #241F1A", paddingTop: 8, fontSize: 12.5, color: "#6B6155" }}>{r.signArtist}</div></div>
          <div><div style={{ borderTop: "1px solid #241F1A", paddingTop: 8, fontSize: 12.5, color: "#6B6155" }}>{r.signClient}</div></div>
        </div>
      </div>
    </div>
  );
}
