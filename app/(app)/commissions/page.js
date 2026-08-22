"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "../../../components/AppContext";
import { supabase } from "../../../lib/supabaseClient";
import { SectionTitle, Btn, Card, Field, Input, Select, TextArea, Modal, EmptyState, Badge } from "../../../components/ui";
import { COMMISSION_STATUS_KEYS, PAYMENT_METHOD_KEYS } from "../../../lib/i18n";
import { money, todayISO, daysBetween } from "../../../lib/helpers";

export default function CommissionsPage() {
  const { t, lang, currency, session } = useApp();
  const c = t.commissions;
  const [commissions, setCommissions] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState(null);

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
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {commissions.map((m) => {
            const remaining = Number(m.price || 0) - Number(m.deposit || 0);
            const dLeft = m.deadline ? daysBetween(todayISO(), m.deadline) : null;
            const overdue = dLeft !== null && dLeft < 0 && !["completed", "cancelled"].includes(m.status);
            return (
              <Card key={m.id} style={{ cursor: "pointer" }} onClick={() => setFormModal({ mode: "edit", commission: m })}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600 }}>{clientMap[m.client_id]?.name || "—"}</div>
                  <Badge label={t.commissionStatus[m.status]} color="#4A7C59" />
                </div>
                <div style={{ fontSize: 14, color: "#5A6459", marginBottom: 12 }}>{m.title}</div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", fontSize: 13.5, marginBottom: 12 }}>
                  <Row label={c.price} value={money(m.price, currency, lang)} />
                  <Row label={c.remaining} value={money(remaining, currency, lang)} />
                  <Row label={c.deadline} value={overdue ? c.overdue : (dLeft !== null ? `${dLeft} ${c.daysLeft}` : "—")} valueColor={overdue ? "#9A4A3E" : undefined} />
                </div>

                <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", gap: 8, flexWrap: "wrap", borderTop: "1px solid #E3E8DE", paddingTop: 10 }}>
                  <Link href={`/contracts?commission=${m.id}`}>
                    <Btn variant="ghost" style={{ padding: "6px 12px", fontSize: 12.5 }}>{t.contracts.title}</Btn>
                  </Link>
                  <Link href={`/receipts/${m.id}`}>
                    <Btn variant="ghost" style={{ padding: "6px 12px", fontSize: 12.5 }}>{c.receipt}</Btn>
                  </Link>
                  <Btn variant="danger" style={{ padding: "6px 12px", fontSize: 12.5 }} onClick={async () => { await supabase.from("commissions").delete().eq("id", m.id).eq("user_id", session.user.id); loadAll(); }}>{t.common.delete}</Btn>
                </div>
              </Card>
            );
          })}
        </div>
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

    </div>
  );
}

function Row({ label, value, valueColor }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#8B958A", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 600, color: valueColor || "#241F1A" }}>{value}</div>
    </div>
  );
}

function CommissionForm({ t, clients, mode, initial, onClose, onSave }) {
  const c = t.commissions;
  const [form, setForm] = useState(initial ? { client_id: initial.client_id, title: initial.title, concept: initial.concept, size: initial.size, medium: initial.medium, price: initial.price, deposit: initial.deposit, deadline: initial.deadline, status: initial.status, notes: initial.notes, payment_method: initial.payment_method || "cash" } : { client_id: clients[0]?.id || "", title: "", concept: "", size: "", medium: "", price: "", deposit: "", deadline: "", status: "inquiry", notes: "", payment_method: "cash" });
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
        <Field label={t.paymentMethod.label}><Select value={form.payment_method} onChange={(e) => set("payment_method", e.target.value)}>{PAYMENT_METHOD_KEYS.map((k) => <option key={k} value={k}>{t.paymentMethod[k]}</option>)}</Select></Field>
      </div>
      <Field label={c.notes}><TextArea value={form.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
      <Btn disabled={saving} onClick={async () => { if (!form.title) return; setSaving(true); await onSave(form); setSaving(false); onClose(); }}>{c.save}</Btn>
    </Modal>
  );
}
