"use client";
import React, { useEffect, useState } from "react";
import { useApp } from "../../../components/AppContext";
import { supabase } from "../../../lib/supabaseClient";
import { SectionTitle, Btn, Card, Field, Input, TextArea, Modal, EmptyState, Row } from "../../../components/ui";
import { money, todayISO } from "../../../lib/helpers";

export default function ExhibitionsPage() {
  const { t, lang, currency, session } = useApp();
  const e = t.exhibitions;
  const [exhibitions, setExhibitions] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState(null);
  const [detail, setDetail] = useState(null);

  async function loadAll() {
    const uid = session.user.id;
    const [ex, aw, lk] = await Promise.all([
      supabase.from("exhibitions").select("*").eq("user_id", uid).order("start_date", { ascending: false }),
      supabase.from("artworks").select("id,title,suggested_price,status").eq("user_id", uid),
      supabase.from("exhibition_artworks").select("*").eq("user_id", uid),
    ]);
    setExhibitions(ex.data || []); setArtworks(aw.data || []); setLinks(lk.data || []);
    setLoading(false);
  }
  useEffect(() => { loadAll(); }, [session]);
  if (loading) return <div style={{ color: "#8A8371" }}>Loading…</div>;

  function worksFor(exId) {
    const ids = links.filter((l) => l.exhibition_id === exId).map((l) => l.artwork_id);
    return artworks.filter((a) => ids.includes(a.id));
  }

  return (
    <div>
      <SectionTitle right={<Btn onClick={() => setFormModal({ mode: "new" })}>{e.add}</Btn>}>{e.title}</SectionTitle>
      {exhibitions.length === 0 ? <EmptyState text={e.empty} actionLabel={e.add} onAction={() => setFormModal({ mode: "new" })} /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {exhibitions.map((ex) => {
            const works = worksFor(ex.id);
            const totalValue = works.reduce((s, a) => s + Number(a.suggested_price || 0), 0);
            return (
              <Card key={ex.id} style={{ cursor: "pointer" }}>
                <div onClick={() => setDetail(ex)}>
                  <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 17 }}>{ex.name}</div>
                  <div style={{ fontSize: 12.5, color: "#8A8371", margin: "4px 0 10px" }}>{ex.venue} · {ex.start_date} → {ex.end_date}</div>
                  <Row label={e.works} value={works.length} />
                  <Row label={e.totalValue} value={money(totalValue, currency, lang)} />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {formModal && (
        <ExhibitionForm t={t} mode={formModal.mode} initial={formModal.exhibition} onClose={() => setFormModal(null)}
          onSave={async (form) => {
            const uid = session.user.id;
            if (formModal.mode === "new") {
              await supabase.from("exhibitions").insert({ ...form, user_id: uid });
              await supabase.from("activity_log").insert({ user_id: uid, action: "Exhibition added", object: form.name });
            } else {
              await supabase.from("exhibitions").update(form).eq("id", formModal.exhibition.id).eq("user_id", uid);
            }
            await loadAll();
          }}
        />
      )}

      {detail && (
        <Modal title={detail.name} onClose={() => setDetail(null)} wide>
          <Row label={e.venue} value={detail.venue} />
          <Row label={e.location} value={detail.location} />
          <Row label={`${detail.start_date} → ${detail.end_date}`} value="" />
          {(() => {
            const works = worksFor(detail.id);
            const totalValue = works.reduce((s, a) => s + Number(a.suggested_price || 0), 0);
            const commission = totalValue * (Number(detail.commission_pct || 0) / 100);
            return (
              <div style={{ background: "#F5F1E8", borderRadius: 8, padding: "10px 14px", margin: "12px 0" }}>
                <Row label={e.totalValue} value={money(totalValue, currency, lang)} />
                <Row label={e.commission} value={money(commission, currency, lang)} />
                <Row label={e.net} value={money(totalValue - commission, currency, lang)} />
                <Row label="Sold during exhibition" value={works.filter((a) => a.status === "sold").length} />
              </div>
            );
          })()}
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#B08D57", margin: "12px 0 8px", textTransform: "uppercase" }}>{e.addWorks}</div>
          <div style={{ maxHeight: 220, overflowY: "auto", border: "1px solid #EAE3D2", borderRadius: 8, padding: 8 }}>
            {artworks.filter((a) => a.status !== "archived").map((a) => {
              const linked = links.some((l) => l.exhibition_id === detail.id && l.artwork_id === a.id);
              return (
                <label key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 4px", fontSize: 13.5 }}>
                  <input type="checkbox" checked={linked} onChange={async () => {
                    const uid = session.user.id;
                    if (linked) await supabase.from("exhibition_artworks").delete().eq("exhibition_id", detail.id).eq("artwork_id", a.id).eq("user_id", uid);
                    else await supabase.from("exhibition_artworks").insert({ exhibition_id: detail.id, artwork_id: a.id, user_id: uid });
                    await loadAll();
                  }} />
                  {a.title}
                </label>
              );
            })}
          </div>
          <div style={{ marginTop: 14 }}><Btn variant="ghost" onClick={() => { setFormModal({ mode: "edit", exhibition: detail }); setDetail(null); }}>{t.common.edit}</Btn></div>
        </Modal>
      )}
    </div>
  );
}

function ExhibitionForm({ t, mode, initial, onClose, onSave }) {
  const e = t.exhibitions;
  const [form, setForm] = useState(initial ? { name: initial.name, venue: initial.venue, location: initial.location, start_date: initial.start_date, end_date: initial.end_date, commission_pct: initial.commission_pct, notes: initial.notes } : { name: "", venue: "", location: "", start_date: todayISO(), end_date: todayISO(), commission_pct: 40, notes: "" });
  const [saving, setSaving] = useState(false);
  function set(k, v) { setForm({ ...form, [k]: v }); }
  return (
    <Modal title={mode === "new" ? e.add : e.name} onClose={onClose}>
      <Field label={e.name}><Input value={form.name} onChange={(ev) => set("name", ev.target.value)} /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <Field label={e.venue}><Input value={form.venue} onChange={(ev) => set("venue", ev.target.value)} /></Field>
        <Field label={e.location}><Input value={form.location} onChange={(ev) => set("location", ev.target.value)} /></Field>
        <Field label={e.startDate}><Input type="date" value={form.start_date} onChange={(ev) => set("start_date", ev.target.value)} /></Field>
        <Field label={e.endDate}><Input type="date" value={form.end_date} onChange={(ev) => set("end_date", ev.target.value)} /></Field>
        <Field label={e.commissionPct}><Input type="number" value={form.commission_pct} onChange={(ev) => set("commission_pct", ev.target.value)} /></Field>
      </div>
      <Field label={e.notes}><TextArea value={form.notes} onChange={(ev) => set("notes", ev.target.value)} /></Field>
      <Btn disabled={saving} onClick={async () => { if (!form.name) return; setSaving(true); await onSave(form); setSaving(false); onClose(); }}>{e.save}</Btn>
    </Modal>
  );
}
