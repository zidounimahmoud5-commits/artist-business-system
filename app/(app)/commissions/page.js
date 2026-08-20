"use client";
import React, { useEffect, useState } from "react";
import { useApp } from "../../../components/AppContext";
import { supabase } from "../../../lib/supabaseClient";
import { SectionTitle, Btn, Card, Field, Input, Select, TextArea, Modal, EmptyState, Badge } from "../../../components/ui";
import { COMMISSION_STATUS_KEYS } from "../../../lib/i18n";
import { money, todayISO, daysBetween } from "../../../lib/helpers";

const CTXT = {
  en: {
    docTitle: "Commission Agreement", agreementNo: "Agreement No.", date: "Date",
    artist: "Artist", client: "Client", artworkDetails: "Artwork Details",
    concept: "Concept", size: "Size", medium: "Medium", deadline: "Delivery Deadline",
    paymentTerms: "Payment Terms", totalPrice: "Total Price", deposit: "Deposit Paid",
    remaining: "Remaining Balance", remainingNote: "The remaining balance is due upon completion and delivery of the artwork.",
    terms: "Terms & Conditions", signArtist: "Artist Signature", signClient: "Client Signature",
    print: "Print / Save PDF", edit: "Edit", done: "Done", close: "Close", contract: "Contract",
    defaultTerms: "The deposit is non-refundable once work has begun.\nAny changes to the agreed concept, size, or medium must be discussed and may affect price and deadline.\nThe artist retains reproduction rights unless otherwise agreed in writing.\nFinal delivery is subject to full payment of the remaining balance.",
  },
  ar: {
    docTitle: "عقد طلب عمل فني", agreementNo: "رقم العقد", date: "التاريخ",
    artist: "الفنان", client: "العميل", artworkDetails: "تفاصيل العمل الفني",
    concept: "الفكرة", size: "المقاس", medium: "الخامة", deadline: "موعد التسليم",
    paymentTerms: "شروط الدفع", totalPrice: "السعر الإجمالي", deposit: "الدفعة الأولى",
    remaining: "المبلغ المتبقي", remainingNote: "يُستحق المبلغ المتبقي عند إتمام العمل وتسليمه.",
    terms: "الشروط والأحكام", signArtist: "توقيع الفنان", signClient: "توقيع العميل",
    print: "طباعة / حفظ PDF", edit: "تعديل", done: "تم", close: "إغلاق", contract: "العقد",
    defaultTerms: "الدفعة الأولى غير قابلة للاسترداد بعد بدء العمل.\nأي تعديل على الفكرة أو المقاس أو الخامة المتفق عليها يجب مناقشته وقد يؤثر على السعر وموعد التسليم.\nيحتفظ الفنان بحقوق إعادة النشر ما لم يُتفق على خلاف ذلك كتابيًا.\nالتسليم النهائي مشروط بسداد كامل المبلغ المتبقي.",
  },
};

export default function CommissionsPage() {
  const { t, lang, currency, session, profile } = useApp();
  const c = t.commissions;
  const [commissions, setCommissions] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState(null);
  const [contractFor, setContractFor] = useState(null);

  async function loadAll() {
    const uid = session.user.id;
    const [cm, cl] = await Promise.all([
      supabase.from("commissions").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("clients").select("*").eq("user_id", uid),
    ]);
    setCommissions(cm.data || []); setClients(cl.data || []);
    setLoading(false);
  }
  useEffect(() => { loadAll(); }, [session]);
  if (loading) return <div style={{ color: "#8A8371" }}>Loading…</div>;
  const clientMap = Object.fromEntries(clients.map((cl) => [cl.id, cl]));

  return (
    <div>
      <SectionTitle right={<Btn onClick={() => setFormModal({ mode: "new" })}>{c.add}</Btn>}>{c.title}</SectionTitle>
      {commissions.length === 0 ? <EmptyState text={c.empty} actionLabel={c.add} onAction={() => setFormModal({ mode: "new" })} /> : (
        <Card style={{ padding: 0, overflowX: "auto" }}>
          <table>
            <thead><tr><th>{c.client}</th><th>{c.concept}</th><th>{c.price}</th><th>{c.remaining}</th><th>{c.deadline}</th><th>{c.status}</th><th></th><th></th></tr></thead>
            <tbody>
              {commissions.map((m) => {
                const remaining = Number(m.price || 0) - Number(m.deposit || 0);
                const dLeft = m.deadline ? daysBetween(todayISO(), m.deadline) : null;
                const overdue = dLeft !== null && dLeft < 0 && !["completed", "cancelled"].includes(m.status);
                return (
                  <tr key={m.id} style={{ cursor: "pointer" }} onClick={() => setFormModal({ mode: "edit", commission: m })}>
                    <td>{clientMap[m.client_id]?.name || "—"}</td>
                    <td>{m.title}</td>
                    <td>{money(m.price, currency, lang)}</td>
                    <td>{money(remaining, currency, lang)}</td>
                    <td style={{ color: overdue ? "#9A4A3E" : undefined, fontWeight: overdue ? 700 : 400 }}>{overdue ? c.overdue : (dLeft !== null ? `${dLeft} ${c.daysLeft}` : "—")}</td>
                    <td><Badge label={t.commissionStatus[m.status]} color="#B08D57" /></td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <Btn variant="ghost" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => setContractFor(m)}>{(CTXT[lang] || CTXT.en).contract}</Btn>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <Btn variant="danger" style={{ padding: "4px 10px", fontSize: 12 }} onClick={async () => { await supabase.from("commissions").delete().eq("id", m.id).eq("user_id", session.user.id); loadAll(); }}>{t.common.delete}</Btn>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {formModal && (
        <CommissionForm t={t} clients={clients} mode={formModal.mode} initial={formModal.commission} onClose={() => setFormModal(null)}
          onSave={async (form) => {
            const uid = session.user.id;
            if (formModal.mode === "new") {
              await supabase.from("commissions").insert({ ...form, user_id: uid });
              await supabase.from("activity_log").insert({ user_id: uid, action: "Commission added", object: form.title });
            } else {
              await supabase.from("commissions").update(form).eq("id", formModal.commission.id).eq("user_id", uid);
            }
            await loadAll();
          }}
        />
      )}

      {contractFor && (
        <ContractModal
          lang={lang} currency={currency} profile={profile}
          client={clientMap[contractFor.client_id]}
          commission={contractFor}
          onClose={() => setContractFor(null)}
        />
      )}
    </div>
  );
}

function ContractModal({ lang, currency, profile, client, commission, onClose }) {
  const x = CTXT[lang] || CTXT.en;
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState({
    concept: commission.concept || commission.title || "",
    size: commission.size || "",
    medium: commission.medium || "",
    deadline: commission.deadline || "",
    price: commission.price || 0,
    deposit: commission.deposit || 0,
    terms: x.defaultTerms,
  });
  function set(k, v) { setData({ ...data, [k]: v }); }
  const remaining = Number(data.price || 0) - Number(data.deposit || 0);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(30,26,22,0.5)", zIndex: 60, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "4vh 16px", overflowY: "auto" }} onClick={onClose}>
      <div dir={dir} onClick={(e) => e.stopPropagation()} style={{ background: "#FBF7EF", borderRadius: 16, padding: 20, width: "100%", maxWidth: 720, marginTop: 20 }}>
        <div className="no-print" style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={() => window.print()}>{x.print}</Btn>
            <Btn variant="ghost" onClick={() => setEditing(!editing)}>{editing ? x.done : x.edit}</Btn>
          </div>
          <Btn variant="ghost" onClick={onClose}>{x.close}</Btn>
        </div>

        <div className="print-area" style={{ background: "#FFFDF9", border: "1px solid #EDE4D0", borderRadius: 14, padding: "32px 28px" }}>
          <div style={{ textAlign: "center", marginBottom: 24, borderBottom: "2px solid #A47C3E", paddingBottom: 16 }}>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, color: "#9C9280", marginBottom: 6 }}>
              {profile?.studio_name || profile?.artist_name}
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, margin: 0 }}>{x.docTitle}</h1>
            <div style={{ fontSize: 12, color: "#9C9280", marginTop: 6 }}>{x.agreementNo}: {commission.id.slice(0, 8).toUpperCase()} · {x.date}: {new Date(commission.created_at).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, textTransform: "uppercase", color: "#9C9280", marginBottom: 4 }}>{x.artist}</div>
              <div style={{ fontWeight: 600 }}>{profile?.artist_name || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, textTransform: "uppercase", color: "#9C9280", marginBottom: 4 }}>{x.client}</div>
              <div style={{ fontWeight: 600 }}>{client?.name || "—"}</div>
            </div>
          </div>

          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, borderBottom: "1px solid #EDE4D0", paddingBottom: 6 }}>{x.artworkDetails}</div>
          {editing ? (
            <div style={{ marginBottom: 20 }}>
              <Field label={x.concept}><TextArea value={data.concept} onChange={(e) => set("concept", e.target.value)} /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
                <Field label={x.size}><Input value={data.size} onChange={(e) => set("size", e.target.value)} /></Field>
                <Field label={x.medium}><Input value={data.medium} onChange={(e) => set("medium", e.target.value)} /></Field>
                <Field label={x.deadline}><Input type="date" value={data.deadline} onChange={(e) => set("deadline", e.target.value)} /></Field>
              </div>
            </div>
          ) : (
            <table style={{ width: "100%", fontSize: 14, marginBottom: 20 }}>
              <tbody>
                <tr><td style={{ padding: "5px 0", color: "#6B6155", width: "35%" }}>{x.concept}</td><td style={{ padding: "5px 0" }}>{data.concept}</td></tr>
                <tr><td style={{ padding: "5px 0", color: "#6B6155" }}>{x.size}</td><td style={{ padding: "5px 0" }}>{data.size || "—"}</td></tr>
                <tr><td style={{ padding: "5px 0", color: "#6B6155" }}>{x.medium}</td><td style={{ padding: "5px 0" }}>{data.medium || "—"}</td></tr>
                <tr><td style={{ padding: "5px 0", color: "#6B6155" }}>{x.deadline}</td><td style={{ padding: "5px 0" }}>{data.deadline || "—"}</td></tr>
              </tbody>
            </table>
          )}

          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, borderBottom: "1px solid #EDE4D0", paddingBottom: 6 }}>{x.paymentTerms}</div>
          {editing ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px", marginBottom: 20 }}>
              <Field label={x.totalPrice}><Input type="number" value={data.price} onChange={(e) => set("price", e.target.value)} /></Field>
              <Field label={x.deposit}><Input type="number" value={data.deposit} onChange={(e) => set("deposit", e.target.value)} /></Field>
            </div>
          ) : (
            <table style={{ width: "100%", fontSize: 14, marginBottom: 20 }}>
              <tbody>
                <tr><td style={{ padding: "5px 0", color: "#6B6155" }}>{x.totalPrice}</td><td style={{ padding: "5px 0", fontWeight: 600 }}>{money(data.price, currency, lang)}</td></tr>
                <tr><td style={{ padding: "5px 0", color: "#6B6155" }}>{x.deposit}</td><td style={{ padding: "5px 0", fontWeight: 600, color: "#5F7A54" }}>{money(data.deposit, currency, lang)}</td></tr>
                <tr><td style={{ padding: "5px 0", color: "#6B6155" }}>{x.remaining}</td><td style={{ padding: "5px 0", fontWeight: 700 }}>{money(remaining, currency, lang)}</td></tr>
              </tbody>
            </table>
          )}
          {!editing && <div style={{ fontSize: 12, color: "#9C9280", marginTop: -12, marginBottom: 20 }}>{x.remainingNote}</div>}

          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, borderBottom: "1px solid #EDE4D0", paddingBottom: 6 }}>{x.terms}</div>
          {editing ? (
            <TextArea value={data.terms} onChange={(e) => set("terms", e.target.value)} style={{ minHeight: 110 }} />
          ) : (
            <ul style={{ margin: 0, paddingInlineStart: 20, fontSize: 13, lineHeight: 1.8 }}>
              {data.terms.split("\n").filter(Boolean).map((line, i) => <li key={i}>{line}</li>)}
            </ul>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 50 }}>
            <div><div style={{ borderTop: "1px solid #241F1A", paddingTop: 8, fontSize: 12.5, color: "#6B6155" }}>{x.signArtist}</div></div>
            <div><div style={{ borderTop: "1px solid #241F1A", paddingTop: 8, fontSize: 12.5, color: "#6B6155" }}>{x.signClient}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommissionForm({ t, clients, mode, initial, onClose, onSave }) {
  const c = t.commissions;
  const [form, setForm] = useState(initial ? { client_id: initial.client_id, title: initial.title, concept: initial.concept, size: initial.size, medium: initial.medium, price: initial.price, deposit: initial.deposit, deadline: initial.deadline, status: initial.status, notes: initial.notes } : { client_id: clients[0]?.id || "", title: "", concept: "", size: "", medium: "", price: "", deposit: "", deadline: "", status: "inquiry", notes: "" });
  const [saving, setSaving] = useState(false);
  function set(k, v) { setForm({ ...form, [k]: v }); }
  return (
    <Modal title={mode === "new" ? c.add : c.title} onClose={onClose}>
      <Field label={c.client}><Select value={form.client_id || ""} onChange={(e) => set("client_id", e.target.value)}>{clients.length === 0 && <option value="">—</option>}{clients.map((cl) => <option key={cl.id} value={cl.id}>{cl.name}</option>)}</Select></Field>
      <Field label={t.artworks.form.titleField}><Input value={form.title} onChange={(e) => set("title", e.target.value)} /></Field>
      <Field label={c.concept}><TextArea value={form.concept} onChange={(e) => set("concept", e.target.value)} /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <Field label={c.size}><Input value={form.size} onChange={(e) => set("size", e.target.value)} /></Field>
        <Field label={c.medium}><Input value={form.medium} onChange={(e) => set("medium", e.target.value)} /></Field>
        <Field label={c.price}><Input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} /></Field>
        <Field label={c.deposit}><Input type="number" value={form.deposit} onChange={(e) => set("deposit", e.target.value)} /></Field>
        <Field label={c.deadline}><Input type="date" value={form.deadline || ""} onChange={(e) => set("deadline", e.target.value)} /></Field>
        <Field label={c.status}><Select value={form.status} onChange={(e) => set("status", e.target.value)}>{COMMISSION_STATUS_KEYS.map((k) => <option key={k} value={k}>{t.commissionStatus[k]}</option>)}</Select></Field>
      </div>
      <Field label={c.notes}><TextArea value={form.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
      <Btn disabled={saving} onClick={async () => { if (!form.title) return; setSaving(true); await onSave(form); setSaving(false); onClose(); }}>{c.save}</Btn>
    </Modal>
  );
}
