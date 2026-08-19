"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useApp } from "../../../../components/AppContext";
import { supabase } from "../../../../lib/supabaseClient";
import { money } from "../../../../lib/helpers";

const TXT = {
  en: {
    docTitle: "Commission Agreement", agreementNo: "Agreement No.", date: "Date",
    artist: "Artist", client: "Client", artworkDetails: "Artwork Details",
    concept: "Concept", size: "Size", medium: "Medium", deadline: "Delivery Deadline",
    paymentTerms: "Payment Terms", totalPrice: "Total Price", deposit: "Deposit Paid",
    remaining: "Remaining Balance", remainingNote: "The remaining balance is due upon completion and delivery of the artwork.",
    terms: "Terms & Conditions",
    termsList: [
      "The deposit is non-refundable once work has begun.",
      "Any changes to the agreed concept, size, or medium must be discussed and may affect price and deadline.",
      "The artist retains reproduction rights unless otherwise agreed in writing.",
      "Final delivery is subject to full payment of the remaining balance.",
    ],
    signArtist: "Artist Signature", signClient: "Client Signature", print: "Print / Save as PDF", notFound: "Commission not found.",
  },
  ar: {
    docTitle: "عقد طلب عمل فني", agreementNo: "رقم العقد", date: "التاريخ",
    artist: "الفنان", client: "العميل", artworkDetails: "تفاصيل العمل الفني",
    concept: "الفكرة", size: "المقاس", medium: "الخامة", deadline: "موعد التسليم",
    paymentTerms: "شروط الدفع", totalPrice: "السعر الإجمالي", deposit: "الدفعة الأولى (المدفوعة)",
    remaining: "المبلغ المتبقي", remainingNote: "يُستحق المبلغ المتبقي عند إتمام العمل وتسليمه.",
    terms: "الشروط والأحكام",
    termsList: [
      "الدفعة الأولى غير قابلة للاسترداد بعد بدء العمل.",
      "أي تعديل على الفكرة أو المقاس أو الخامة المتفق عليها يجب مناقشته وقد يؤثر على السعر وموعد التسليم.",
      "يحتفظ الفنان بحقوق إعادة النشر ما لم يُتفق على خلاف ذلك كتابيًا.",
      "التسليم النهائي مشروط بسداد كامل المبلغ المتبقي.",
    ],
    signArtist: "توقيع الفنان", signClient: "توقيع العميل", print: "طباعة / حفظ PDF", notFound: "لم يتم العثور على الطلب.",
  },
};

export default function ContractPage() {
  const { id } = useParams();
  const { lang, currency, profile, session } = useApp();
  const x = TXT[lang] || TXT.en;
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
  if (!commission) return <div style={{ color: "#8A8371" }}>{x.notFound}</div>;

  const remaining = Number(commission.price || 0) - Number(commission.deposit || 0);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir}>
      <button className="no-print" onClick={() => window.print()} style={{ marginBottom: 20, background: "#A47C3E", color: "#FFFDF9", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{x.print}</button>

      <div style={{ background: "#FFFDF9", border: "1px solid #EDE4D0", borderRadius: 14, padding: "40px 36px", maxWidth: 720, margin: "0 auto", fontFamily: "var(--font-body)", color: "#241F1A" }}>
        <div style={{ textAlign: "center", marginBottom: 28, borderBottom: "2px solid #A47C3E", paddingBottom: 18 }}>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, color: "#9C9280", marginBottom: 6 }}>
            {profile?.studio_name || profile?.artist_name}
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, margin: 0 }}>{x.docTitle}</h1>
          <div style={{ fontSize: 12.5, color: "#9C9280", marginTop: 8 }}>{x.agreementNo}: {commission.id.slice(0, 8).toUpperCase()} · {x.date}: {new Date(commission.created_at).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, color: "#9C9280", marginBottom: 4 }}>{x.artist}</div>
            <div style={{ fontWeight: 600 }}>{profile?.artist_name || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, color: "#9C9280", marginBottom: 4 }}>{x.client}</div>
            <div style={{ fontWeight: 600 }}>{client?.name || "—"}</div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, borderBottom: "1px solid #EDE4D0", paddingBottom: 6 }}>{x.artworkDetails}</div>
          <table style={{ width: "100%", fontSize: 14 }}>
            <tbody>
              <tr><td style={{ padding: "5px 0", color: "#6B6155", width: "35%" }}>{x.concept}</td><td style={{ padding: "5px 0" }}>{commission.concept || commission.title}</td></tr>
              <tr><td style={{ padding: "5px 0", color: "#6B6155" }}>{x.size}</td><td style={{ padding: "5px 0" }}>{commission.size || "—"}</td></tr>
              <tr><td style={{ padding: "5px 0", color: "#6B6155" }}>{x.medium}</td><td style={{ padding: "5px 0" }}>{commission.medium || "—"}</td></tr>
              <tr><td style={{ padding: "5px 0", color: "#6B6155" }}>{x.deadline}</td><td style={{ padding: "5px 0" }}>{commission.deadline || "—"}</td></tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, borderBottom: "1px solid #EDE4D0", paddingBottom: 6 }}>{x.paymentTerms}</div>
          <table style={{ width: "100%", fontSize: 14 }}>
            <tbody>
              <tr><td style={{ padding: "5px 0", color: "#6B6155" }}>{x.totalPrice}</td><td style={{ padding: "5px 0", fontWeight: 600 }}>{money(commission.price, currency, lang)}</td></tr>
              <tr><td style={{ padding: "5px 0", color: "#6B6155" }}>{x.deposit}</td><td style={{ padding: "5px 0", fontWeight: 600, color: "#5F7A54" }}>{money(commission.deposit, currency, lang)}</td></tr>
              <tr><td style={{ padding: "5px 0", color: "#6B6155" }}>{x.remaining}</td><td style={{ padding: "5px 0", fontWeight: 700 }}>{money(remaining, currency, lang)}</td></tr>
            </tbody>
          </table>
          <div style={{ fontSize: 12.5, color: "#9C9280", marginTop: 8 }}>{x.remainingNote}</div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, borderBottom: "1px solid #EDE4D0", paddingBottom: 6 }}>{x.terms}</div>
          <ul style={{ margin: 0, paddingInlineStart: 20, fontSize: 13, color: "#3A342B", lineHeight: 1.8 }}>
            {x.termsList.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 50 }}>
          <div><div style={{ borderTop: "1px solid #241F1A", paddingTop: 8, fontSize: 12.5, color: "#6B6155" }}>{x.signArtist}</div></div>
          <div><div style={{ borderTop: "1px solid #241F1A", paddingTop: 8, fontSize: 12.5, color: "#6B6155" }}>{x.signClient}</div></div>
        </div>
      </div>
    </div>
  );
}
