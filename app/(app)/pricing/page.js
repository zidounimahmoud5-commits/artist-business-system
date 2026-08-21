"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calculator, BarChart3, Frame, DollarSign, Clock, Package,
  TrendingUp, MoreHorizontal, Truck, Gift, Receipt, Tag, Image as ImageIcon,
  ShieldCheck, Percent, Sparkles, Lightbulb, ChevronDown,
} from "lucide-react";
import { useApp } from "../../../components/AppContext";
import { Card, Field, Input, Btn } from "../../../components/ui";
import { money } from "../../../lib/helpers";

const INK = "#241F1A";
const GOLD = "#A47C3E";
const GOLD_DEEP = "#8C6530";
const TEXT_MUTED = "#9C9280";
const TEXT_SECONDARY = "#6B6155";
const BORDER = "#EDE4D0";
const GREEN = "#5F7A5A";
const GREEN_BG = "rgba(95,122,90,0.08)";
const AMBER_BG = "rgba(164,124,62,0.12)";

function IconBadge({ icon: Icon, tone = "gold" }) {
  const bg = tone === "green" ? "rgba(95,122,90,0.14)" : AMBER_BG;
  const color = tone === "green" ? GREEN : GOLD_DEEP;
  return (
    <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon size={19} color={color} strokeWidth={2} />
    </div>
  );
}

function FieldTile({ icon: Icon, label, value, onChange, unit }) {
  return (
    <div style={{ padding: "6px 4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <Icon size={16} color={GOLD_DEEP} strokeWidth={1.8} />
        <span style={{ fontSize: 12, color: TEXT_SECONDARY, fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", border: `1px solid ${BORDER}`, borderRadius: 9, overflow: "hidden", background: "#FFFDF9" }}>
        <input
          type="number"
          value={value}
          onChange={onChange}
          style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", padding: "8px 8px", fontSize: 14, color: INK, textAlign: "start", fontFamily: "inherit" }}
        />
        <span style={{ fontSize: 11, color: TEXT_MUTED, padding: "0 8px", borderInlineStart: `1px solid ${BORDER}`, alignSelf: "stretch", display: "flex", alignItems: "center" }}>{unit}</span>
      </div>
    </div>
  );
}

function ResultRow({ icon: Icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 2px", borderBottom: `1px solid #F2EBDA` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Icon size={16} color={GOLD_DEEP} strokeWidth={1.8} />
        <span style={{ fontSize: 13.5, color: TEXT_SECONDARY }}>{label}</span>
      </div>
      <span style={{ fontWeight: 700, color: GREEN, fontSize: 14.5 }}>{value}</span>
    </div>
  );
}

export default function PricingPage() {
  const { t, lang, currency, profile } = useApp();
  const router = useRouter();
  const p = t.pricing;
  const [showMore, setShowMore] = useState(false);
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

  const hourUnit = p.unitHour || (lang === "ar" ? "ساعة" : "hrs");

  const FIELDS = [
    { key: "frameCost", icon: Frame, unit: currency },
    { key: "laborRate", icon: DollarSign, unit: currency },
    { key: "laborHours", icon: Clock, unit: hourUnit },
    { key: "materialCost", icon: Package, unit: currency },
    { key: "margin", icon: TrendingUp, unit: "%" },
    { key: "otherCosts", icon: MoreHorizontal, unit: currency },
    { key: "shippingCost", icon: Truck, unit: currency },
    { key: "packagingCost", icon: Gift, unit: currency },
  ];

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: INK, margin: "0 0 8px", position: "relative", display: "inline-block", paddingBottom: 10 }}>
          {p.title}
          <span style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 54, height: 2.5, backgroundImage: `linear-gradient(to right, ${GOLD_DEEP}, ${GOLD})`, borderRadius: 2 }} />
        </h1>
        <div style={{ fontSize: 13.5, color: TEXT_SECONDARY }}>{p.subtitle}</div>
      </div>

      <Card className="pricing-card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: INK }}>{p.inputs}</div>
          <IconBadge icon={Calculator} tone="gold" />
        </div>
        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px 10px" }}>
          {FIELDS.map((f) => (
            <FieldTile key={f.key} icon={f.icon} label={p[f.key]} unit={f.unit} value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} />
          ))}
        </div>

        <button onClick={() => setShowMore((s) => !s)} style={{
          width: "100%", marginTop: 14, background: "#FBF7EF", border: `1px solid ${BORDER}`, borderRadius: 10,
          padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontFamily: "inherit",
        }}>
          <span style={{ fontSize: 13, color: TEXT_SECONDARY, fontWeight: 600 }}>{p.moreDetails}</span>
          <ChevronDown size={17} color={TEXT_SECONDARY} style={{ transform: showMore ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} />
        </button>

        {showMore && (
          <div style={{ marginTop: 14 }}>
            <Field label={p.galleryCommission}>
              <Input type="number" value={form.galleryCommission} onChange={(e) => set("galleryCommission", e.target.value)} />
            </Field>
          </div>
        )}
      </Card>

      <Card className="pricing-card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: INK }}>{p.results}</div>
          <IconBadge icon={BarChart3} tone="green" />
        </div>

        <ResultRow icon={Receipt} label={p.totalCost} value={money(totalCost, currency, lang)} />
        <ResultRow icon={Tag} label={p.directPrice} value={money(directPrice, currency, lang)} />
        <ResultRow icon={ImageIcon} label={p.galleryPrice} value={money(galleryPrice, currency, lang)} />
        <ResultRow icon={ShieldCheck} label={p.minPrice} value={money(minPrice, currency, lang)} />
        <ResultRow icon={TrendingUp} label={p.expectedProfit} value={money(expectedProfit, currency, lang)} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: GREEN_BG, borderRadius: 10, padding: "12px 14px", margin: "12px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Percent size={16} color={GREEN} strokeWidth={2} />
            <span style={{ fontSize: 13.5, fontWeight: 700, color: GREEN }}>{p.profitMargin}</span>
