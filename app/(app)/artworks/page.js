"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "../../../components/AppContext";
import { supabase } from "../../../lib/supabaseClient";
import { SectionTitle, Btn, Input, Select, TextArea, Field, Modal, Badge, EmptyState, Row } from "../../../components/ui";
import { STATUS_KEYS, STATUS_COLORS, LOCATION_KEYS } from "../../../lib/i18n";
import { money, calcArtworkCost, todayISO } from "../../../lib/helpers";

export default function ArtworksPage() {
  const { t, lang, currency, session, profile } = useApp();
  const [artworks, setArtworks] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [formModal, setFormModal] = useState(null); // { mode, artwork }
  const [detail, setDetail] = useState(null); // artwork
  const [saleModal, setSaleModal] = useState(null); // artwork

  async function loadAll() {
    const uid = session.user.id;
    const [a, c] = await Promise.all([
      supabase.from("artworks").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("clients").select("*").eq("user_id", uid),
    ]);
    setArtworks(a.data || []);
    setClients(c.data || []);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, [session]);

  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setFormModal({ mode: "new" });
      router.replace("/artworks");
    } else if (searchParams.get("prefill") === "1") {
      const raw = sessionStorage.getItem("abs_pricing_prefill");
      sessionStorage.removeItem("abs_pricing_prefill");
      setFormModal({ mode: "new", artwork: raw ? JSON.parse(raw) : null });
      router.replace("/artworks");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (loading) return <div style={{ color: "#8A8371" }}>Loading…</div>;

  const filtered = artworks.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (search && !`${a.title} ${a.code} ${a.medium}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c]));

  return (
    <div>
      <SectionTitle right={<Btn onClick={() => setFormModal({ mode: "new" })}>{t.artworks.add}</Btn>}>{t.artworks.title}</SectionTitle>

      {artworks.length === 0 ? (
        <EmptyState text={t.artworks.empty} actionLabel={t.artworks.emptyAdd} onAction={() => setFormModal({ mode: "new" })} />
      ) : (
        <>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <Input placeholder={t.artworks.search} value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 240 }} />
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ maxWidth: 180 }}>
              <option value="all">{t.artworks.filterAll}</option>
              {STATUS_KEYS.map((k) => <option key={k} value={k}>{t.status[k]}</option>)}
            </Select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {filtered.map((a) => (
              <div key={a.id} onClick={() => setDetail(a)} style={{ cursor: "pointer", background: "#FFFEFB", border: "1px solid #EAE3D2", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ height: 130, background: a.image ? `url(${a.image}) center/cover` : "#EFE9DA", display: "flex", alignItems: "center", justifyContent: "center", color: "#B0A98F", fontFamily: "var(--font-display)", fontStyle: "italic" }}>
                  {!a.image && a.title}
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ fontSize: 10.5, color: "#B0A98F", letterSpacing: 0.5 }}>{a.code}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 16, margin: "3px 0 2px" }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: "#8A8371", marginBottom: 8 }}>{a.medium}{a.year ? `, ${a.year}` : ""}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Badge label={t.status[a.status]} color={STATUS_COLORS[a.status]} />
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{a.suggested_price ? money(a.suggested_price, currency, lang) : "—"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {formModal && (
        <ArtworkForm t={t} lang={lang} currency={currency} defaults={profile} mode={formModal.mode} initial={formModal.artwork}
          onClose={() => setFormModal(null)}
          onSave={async (form) => {
            const uid = session.user.id;
            if (formModal.mode === "new") {
              const { data: codeData } = await supabase.rpc("next_artwork_code");
              const { data: inserted } = await supabase.from("artworks").insert({ ...form, user_id: uid, code: codeData }).select().single();
              await supabase.from("artwork_history").insert({ user_id: uid, artwork_id: inserted.id, action: "Created" });
              await supabase.from("activity_log").insert({ user_id: uid, action: "Artwork added", object: form.title });
            } else {
              await supabase.from("artworks").update(form).eq("id", formModal.artwork.id).eq("user_id", uid);
              await supabase.from("artwork_history").insert({ user_id: uid, artwork_id: formModal.artwork.id, action: "Updated" });
            }
            await loadAll();
          }}
        />
      )}

      {detail && (
        <ArtworkDetail t={t} lang={lang} currency={currency} artwork={detail} clientMap={clientMap}
          onClose={() => setDetail(null)}
          onEdit={() => { setFormModal({ mode: "edit", artwork: detail }); setDetail(null); }}
          onReserve={async () => {
            await supabase.from("artworks").update({ status: "reserved", reserved_at: todayISO() }).eq("id", detail.id).eq("user_id", session.user.id);
            await supabase.from("artwork_history").insert({ user_id: session.user.id, artwork_id: detail.id, action: "Marked reserved" });
            setDetail(null); await loadAll();
          }}
          onSell={() => { setSaleModal(detail); setDetail(null); }}
          onArchive={async () => {
            await supabase.from("artworks").update({ status: "archived" }).eq("id", detail.id).eq("user_id", session.user.id);
            await supabase.from("artwork_history").insert({ user_id: session.user.id, artwork_id: detail.id, action: "Archived" });
            setDetail(null); await loadAll();
          }}
        />
      )}

      {saleModal && (
        <SaleModal t={t} lang={lang} currency={currency} artwork={saleModal} clients={clients}
          onClose={() => setSaleModal(null)}
          onConfirm={async (form) => {
            const { error } = await supabase.rpc("record_sale", {
              p_artwork_id: saleModal.id, p_client_id: form.clientId, p_date: form.date,
              p_price: Number(form.price), p_discount: Number(form.discount || 0), p_shipping: Number(form.shipping || 0),
              p_payment_fee: Number(form.paymentFee || 0), p_gallery_commission_pct: Number(form.galleryCommission || 0),
            });
            if (error) { alert(error.message); return; }
            setSaleModal(null); await loadAll();
          }}
        />
      )}
    </div>
  );
}

function ArtworkForm({ t, lang, currency, defaults, mode, initial, onClose, onSave }) {
  const f = t.artworks.form;
  const base = {
    title: "", medium: "", year: new Date().getFullYear(), width: "", height: "", unit: "cm",
    material_cost: "", labor_hours: "", labor_rate: defaults?.default_hourly_rate || 15,
    frame_cost: 0, packaging_cost: 0, shipping_cost: 0, other_costs: 0,
    suggested_price: "", min_price: "", gallery_price: "",
    status: "available", location: "studio", notes: "", image: "",
  };
  const [form, setForm] = useState(() => ({ ...base, ...(initial || {}) }));
  const [saving, setSaving] = useState(false);
  function set(k, v) { setForm({ ...form, [k]: v }); }
  const totalCost = calcArtworkCost(form);

  async function submit() {
    if (!form.title || saving) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  }

  return (
    <Modal title={mode === "new" ? t.artworks.add : t.artworks.edit} onClose={onClose} wide>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#B08D57", marginBottom: 8, textTransform: "uppercase" }}>{f.section1}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <Field label={f.titleField}><Input value={form.title} onChange={(e) => set("title", e.target.value)} /></Field>
        <Field label={f.medium}><Input value={form.medium} onChange={(e) => set("medium", e.target.value)} /></Field>
        <Field label={f.year}><Input type="number" value={form.year} onChange={(e) => set("year", e.target.value)} /></Field>
        <Field label={f.unit}><Select value={form.unit} onChange={(e) => set("unit", e.target.value)}><option value="cm">cm</option><option value="in">in</option></Select></Field>
        <Field label={f.width}><Input type="number" value={form.width} onChange={(e) => set("width", e.target.value)} /></Field>
        <Field label={f.height}><Input type="number" value={form.height} onChange={(e) => set("height", e.target.value)} /></Field>
      </div>
      <Field label={f.imageUrl}><Input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://…" /></Field>

      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#B08D57", margin: "16px 0 8px", textTransform: "uppercase" }}>{f.section2}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
        <Field label={f.materialCost}><Input type="number" value={form.material_cost} onChange={(e) => set("material_cost", e.target.value)} /></Field>
        <Field label={f.laborHours}><Input type="number" value={form.labor_hours} onChange={(e) => set("labor_hours", e.target.value)} /></Field>
        <Field label={f.laborRate}><Input type="number" value={form.labor_rate} onChange={(e) => set("labor_rate", e.target.value)} /></Field>
        <Field label={f.frameCost}><Input type="number" value={form.frame_cost} onChange={(e) => set("frame_cost", e.target.value)} /></Field>
        <Field label={f.packagingCost}><Input type="number" value={form.packaging_cost} onChange={(e) => set("packaging_cost", e.target.value)} /></Field>
        <Field label={f.shippingCost}><Input type="number" value={form.shipping_cost} onChange={(e) => set("shipping_cost", e.target.value)} /></Field>
      </div>
      <div style={{ background: "#F5F1E8", borderRadius: 8, padding: "10px 14px", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{f.totalCost}: {money(totalCost, currency, lang)}</div>

      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#B08D57", margin: "16px 0 8px", textTransform: "uppercase" }}>{f.section3}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
        <Field label={f.suggestedPrice}><Input type="number" value={form.suggested_price} onChange={(e) => set("suggested_price", e.target.value)} /></Field>
        <Field label={f.minPrice}><Input type="number" value={form.min_price} onChange={(e) => set("min_price", e.target.value)} /></Field>
        <Field label={f.galleryPrice}><Input type="number" value={form.gallery_price} onChange={(e) => set("gallery_price", e.target.value)} /></Field>
      </div>

      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#B08D57", margin: "16px 0 8px", textTransform: "uppercase" }}>{f.section4}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <Field label={f.status}><Select value={form.status} onChange={(e) => set("status", e.target.value)}>{STATUS_KEYS.map((k) => <option key={k} value={k}>{t.status[k]}</option>)}</Select></Field>
        <Field label={f.location}><Select value={form.location} onChange={(e) => set("location", e.target.value)}>{LOCATION_KEYS.map((k) => <option key={k} value={k}>{t.location[k]}</option>)}</Select></Field>
      </div>
      <Field label={f.notes}><TextArea value={form.notes} onChange={(e) => set("notes", e.target.value)} /></Field>

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Btn onClick={submit} disabled={saving}>{f.save}</Btn>
        <Btn variant="ghost" onClick={onClose}>{f.cancel}</Btn>
      </div>
    </Modal>
  );
}

function ArtworkDetail({ t, lang, currency, artwork: a, clientMap, onClose, onEdit, onReserve, onSell, onArchive }) {
  const d = t.artworks.detail;
  const cost = calcArtworkCost(a);
  const profit = Number(a.suggested_price || 0) - cost;
  const buyer = a.client_id ? clientMap[a.client_id] : null;
  const [history, setHistory] = useState(null);

  useEffect(() => {
    supabase.from("artwork_history").select("*").eq("artwork_id", a.id).order("date", { ascending: false }).then(({ data }) => setHistory(data || []));
  }, [a.id]);

  return (
    <Modal title={a.title} onClose={onClose} wide>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ width: 180, height: 180, background: a.image ? `url(${a.image}) center/cover` : "#EFE9DA", borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#B0A98F", fontFamily: "var(--font-display)", fontStyle: "italic", textAlign: "center", padding: 10 }}>
          {!a.image && a.title}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 11, color: "#B0A98F", letterSpacing: 0.5, marginBottom: 4 }}>{a.code}</div>
          <div style={{ marginBottom: 8 }}><Badge label={t.status[a.status]} color={STATUS_COLORS[a.status]} /></div>
          <Row label={d.cost} value={money(cost, currency, lang)} />
          <Row label={t.artworks.form.suggestedPrice} value={a.suggested_price ? money(a.suggested_price, currency, lang) : "—"} />
          <Row label={d.profit} value={money(profit, currency, lang)} />
          <Row label={d.location} value={t.location[a.location] || a.location} />
          {buyer && <Row label={d.soldTo} value={`${buyer.name}${a.sale_date ? " · " + a.sale_date : ""}`} />}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "18px 0" }}>
        <Btn variant="ghost" onClick={onEdit}>{t.common.edit}</Btn>
        {a.status !== "sold" && a.status !== "archived" && (<><Btn variant="ghost" onClick={onReserve}>{d.reserve}</Btn><Btn onClick={onSell}>{d.markSold}</Btn></>)}
        {a.status !== "archived" && <Btn variant="danger" onClick={onArchive}>{d.delete}</Btn>}
      </div>

      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#B08D57", margin: "10px 0 8px", textTransform: "uppercase" }}>{d.history}</div>
      {(history || []).map((h) => (
        <div key={h.id} style={{ display: "flex", gap: 10, fontSize: 13, padding: "5px 0", borderBottom: "1px solid #F0EBDD" }}>
          <span style={{ color: "#8A8371", minWidth: 140 }}>{new Date(h.date).toLocaleString(lang === "ar" ? "ar" : "en")}</span>
          <span>{h.action}</span>
        </div>
      ))}
      {a.notes && <><div style={{ fontSize: 12.5, fontWeight: 700, color: "#B08D57", margin: "14px 0 6px", textTransform: "uppercase" }}>{t.artworks.form.notes}</div><div style={{ fontSize: 13.5, color: "#5B564B" }}>{a.notes}</div></>}
    </Modal>
  );
}

function SaleModal({ t, lang, currency, artwork, clients, onClose, onConfirm }) {
  const d = t.artworks.detail;
  const [form, setForm] = useState({ clientId: clients[0]?.id || "", price: artwork.suggested_price || "", date: todayISO(), discount: 0, shipping: 0, paymentFee: 0, galleryCommission: 0 });
  const [saving, setSaving] = useState(false);
  const net = Number(form.price || 0) - Number(form.discount || 0) - Number(form.shipping || 0) - Number(form.paymentFee || 0) - (Number(form.price || 0) * Number(form.galleryCommission || 0) / 100);
  const cost = calcArtworkCost(artwork);
  return (
    <Modal title={`${d.markSold} — ${artwork.title}`} onClose={onClose}>
      {clients.length === 0 ? <div style={{ color: "#9A4A3E", fontSize: 14 }}>{d.noBuyer}</div> : (
        <>
          <Field label={d.buyer}><Select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>{clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Field label={d.salePrice}><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></Field>
            <Field label={d.saleDate}><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
            <Field label={d.discount}><Input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} /></Field>
            <Field label={d.shippingFee}><Input type="number" value={form.shipping} onChange={(e) => setForm({ ...form, shipping: e.target.value })} /></Field>
            <Field label={d.paymentFee}><Input type="number" value={form.paymentFee} onChange={(e) => setForm({ ...form, paymentFee: e.target.value })} /></Field>
            <Field label={d.galleryCommission}><Input type="number" value={form.galleryCommission} onChange={(e) => setForm({ ...form, galleryCommission: e.target.value })} /></Field>
          </div>
          <div style={{ background: "#F5F1E8", borderRadius: 8, padding: "10px 14px", fontSize: 14, marginBottom: 14 }}>
            <Row label={d.netRevenue} value={money(net, currency, lang)} />
            <Row label={d.actualProfit} value={money(net - cost, currency, lang)} />
          </div>
          <Btn disabled={saving} onClick={async () => { setSaving(true); await onConfirm(form); setSaving(false); }}>{d.confirmSale}</Btn>
        </>
      )}
    </Modal>
  );
}
