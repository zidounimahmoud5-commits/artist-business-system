"use client";
import React, { useEffect, useState } from "react";
import { useApp } from "../../../components/AppContext";
import { supabase } from "../../../lib/supabaseClient";
import { SectionTitle, Btn, Card, Field, Input, Select, TextArea, Modal, EmptyState, Row } from "../../../components/ui";
import { CLIENT_TYPE_KEYS } from "../../../lib/i18n";
import { money } from "../../../lib/helpers";

export default function ClientsPage() {
  const { t, lang, currency, session } = useApp();
  const c = t.clients;
  const [clients, setClients] = useState([]);
  const [sales, setSales] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState(null);
  const [detail, setDetail] = useState(null);

  async function loadAll() {
    const uid = session.user.id;
    const [cl, s, a] = await Promise.all([
      supabase.from("clients").select("*").eq("user_id", uid).order("name"),
      supabase.from("sales").select("*").eq("user_id", uid),
      supabase.from("artworks").select("id,title").eq("user_id", uid),
    ]);
    setClients(cl.data || []); setSales(s.data || []); setArtworks(a.data || []);
    setLoading(false);
  }
  useEffect(() => { loadAll(); }, [session]);
  if (loading) return <div style={{ color: "#8A8371" }}>Loading...</div>;

  const artworkMap = Object.fromEntries(artworks.map((a) => [a.id, a]));

  return (
    <div>
      <SectionTitle right={<Btn onClick={() => setFormModal({ mode: "new" })}>{c.add}</Btn>}>{c.title}</SectionTitle>
      {clients.length === 0 ? <EmptyState text={c.empty} actionLabel={c.add} onAction={() => setFormModal({ mode: "new" })} /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
        {clients.map((cl) => (
          <Card key={cl.id} style={{ cursor: "pointer" }}>
            <div onClick={() => setDetail(cl)}>
              <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 17 }}>{cl.name}</div>
              <div style={{ fontSize: 12.5, color: "#8A8371", margin: "4px 0 8px" }}>{t.clientType[cl.type]}</div>
              <div style={{ fontSize: 13 }}>{cl.city}{cl.city && cl.country ? ", " : ""}{cl.country}</div>
            </div>
          </Card>
        ))}
        </div>
      )}

      {formModal && (
        <ClientForm t={t} mode={formModal.mode} initial={formModal.client} onClose={() => setFormModal(null)}
          onSave={async (form) => {
            const uid = session.user.id;
            if (formModal.mode === "new") {
              await supabase.from("clients").insert({ ...form, user_id: uid });
              await supabase.from("activity_log").insert({ user_id: uid, action: "Client added", object: form.name });
            } else {
              await supabase.from("clients").update(form).eq("id", formModal.client.id).eq("user_id", uid);
            }
            await loadAll();
          }}
        />
      )}

      {detail && (
        <Modal title={detail.name} onClose={() => setDetail(null)}>
          <Row label={c.email} value={detail.email || "—"} />
          <Row label={c.phone} value={detail.phone || "—"} />
          <Row label={c.city} value={[detail.city, detail.country].filter(Boolean).join(", ") || "—"} />
          <Row label={c.totalSpent} value={money(sales.filter((s) => s.client_id === detail.id).reduce((sum, s) => sum + Number(s.net_revenue || 0), 0), currency, lang)} />
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#B08D57", margin: "16px 0 8px", textTransform: "uppercase" }}>{c.purchaseHistory}</div>
          {sales.filter((s) => s.client_id === detail.id).length === 0 ? 
            <div style={{ fontSize: 13.5, color: "#8A8371" }}>{c.noPurchases}</div> : 
            sales.filter((s) => s.client_id === detail.id).map((s) => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F0EBDD", fontSize: 13.5 }}>
                <span>{artworkMap[s.artwork_id]?.title || s.artwork_id}</span>
                <span style={{ fontWeight: 600 }}>{money(s.price, currency, lang)}</span>
              </div>
            ))}
            <div style={{ marginTop: 14 }}><Btn variant="ghost" onClick={() => { setFormModal({ mode: "edit", client: detail });
              setDetail(null); }}>{t.common.edit}</Btn>
            </div>
        </Modal>
      )}
    </div>
  );
}

function ClientForm({ t, mode, initial, onClose, onSave }) {
  const c = t.clients;
  const [form, setForm] = useState(initial ? { name: initial.name, type: initial.type, email: initial.email, phone: initial.phone, country: initial.country, city: initial.city, notes: initial.notes } : { name: "", type: "client", email: "", phone: "", country: "", city: "", notes: "" });
  const [saving, setSaving] = useState(false);
  function set(k, v) { setForm({ ...form, [k]: v }); }
  return (
    <Modal title={mode === "new" ? c.add : c.name} onClose={onClose}>
      <Field label={c.name}><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
      <Field label={c.type}><Select value={form.type} onChange={(e) => set("type", e.target.value)}>{CLIENT_TYPE_KEYS.map((k) => <option key={k} value={k}>{t.clientType[k]}</option>)}</Select>
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <Field label={c.email}><Input value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
        <Field label={c.phone}><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
        <Field label={c.city}><Input value={form.city} onChange={(e) => set("city", e.target.value)} /></Field>
        <Field label={c.country}><Input value={form.country} onChange={(e) => set("country", e.target.value)} /></Field>
      </div>
      <Field label={c.notes}><TextArea value={form.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
      <Btn disabled={saving} onClick={async () => { if (!form.name) return; setSaving(true); await onSave(form); setSaving(false); onClose(); }}>{c.save}</Btn>
    </Modal>
  );
}
