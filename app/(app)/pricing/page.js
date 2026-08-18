"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../../components/AppContext";
import { SectionTitle, Card, Field, Input, Btn, Row } from "../../../components/ui";
import { money } from "../../../lib/helpers";

export default function PricingPage() {
  const { t, lang, currency, profile } = useApp();
  const router = useRouter();
  const p = t.pricing;
  const [form, setForm] = useState({
    materialCost: "", laborHours: "", laborRate: profile?.default_hourly_rate || 15,
    frameCost: "", packagingCost: "", shippingCost: "", otherCosts: "",
    margin: profile?.default_margin || 60, galleryCommission: profile?.default_gallery_commission || 40,
  });
  function set(k, v) { setForm({ ...form, [k]: v }); }
  const totalCost = Number(form.materialCost || 0) + Number(form.laborHours || 0) * Number(form.laborRate || 0) +
    Number(form.frameCost || 0) + Number(form.packagingCost || 0) + Number(form.shippingCost || 0) + Number(form.otherCosts || 0);
  const directPrice = totalCost * (1 + Number(form.margin || 0) / 100);
  const galleryPrice = form.galleryCommission < 100 ? directPrice / (1 - Number(form.galleryCommission || 0) / 100) : directPrice;
  const minPrice = totalCost * 1.1;
  const expectedProfit = directPrice - totalCost;
  const profitMarginPct = directPrice > 0 ? (expectedProfit / directPrice) * 100 : 0;

  return (
    <div>
      <SectionTitle>{p.title}</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>{p.inputs}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
            <Field label={p.materialCost}><Input type="number" value={form.materialCost} onChange={(e) => set("materialCost", e.target.value)} /></Field>
            <Field label={p.laborHours}><Input type="number" value={form.laborHours} onChange={(e) => set("laborHours", e.target.value)} /></Field>
            <Field label={p.laborRate}><Input type="number" value={form.laborRate} onChange={(e) => set("laborRate", e.target.value)} /></Field>
            <Field label={p.frameCost}><Input type="number" value={form.frameCost} onChange={(e) => set("frameCost", e.target.value)} /></Field>
            <Field label={p.packagingCost}><Input type="number" value={form.packagingCost} onChange={(e) => set("packagingCost", e.target.value)} /></Field>
            <Field label={p.shippingCost}><Input type="number" value={form.shippingCost} onChange={(e) => set("shippingCost", e.target.value)} /></Field>
            <Field label={p.otherCosts}><Input type="number" value={form.otherCosts} onChange={(e) => set("otherCosts", e.target.value)} /></Field>
            <Field label={p.margin}><Input type="number" value={form.margin} onChange={(e) => set("margin", e.target.value)} /></Field>
            <Field label={p.galleryCommission}><Input type="number" value={form.galleryCommission} onChange={(e) => set("galleryCommission", e.target.value)} /></Field>
          </div>
        </Card>
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>{p.results}</div>
          <Row label={p.totalCost} value={money(totalCost, currency, lang)} />
          <Row label={p.directPrice} value={money(directPrice, currency, lang)} />
          <Row label={p.galleryPrice} value={money(galleryPrice, currency, lang)} />
          <Row label={p.minPrice} value={money(minPrice, currency, lang)} />
          <Row label={p.expectedProfit} value={money(expectedProfit, currency, lang)} />
          <Row label={p.profitMargin} value={profitMarginPct.toFixed(1) + "%"} />
          <div style={{ marginTop: 16 }}>
            <Btn onClick={() => {
              sessionStorage.setItem("abs_pricing_prefill", JSON.stringify({
                material_cost: form.materialCost, labor_hours: form.laborHours, labor_rate: form.laborRate,
                frame_cost: form.frameCost, packaging_cost: form.packagingCost, shipping_cost: form.shippingCost, other_costs: form.otherCosts,
                suggested_price: +directPrice.toFixed(2), min_price: +minPrice.toFixed(2), gallery_price: +galleryPrice.toFixed(2),
              }));
              router.push("/artworks?prefill=1");
            }}>{p.useCalculator}</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}
