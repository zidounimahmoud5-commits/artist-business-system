"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../../components/AppContext";
import { supabase } from "../../../lib/supabaseClient";
import { SectionTitle, StatTile, Card, Btn, Row } from "../../../components/ui";
import { STATUS_KEYS } from "../../../lib/i18n";
import { money, todayISO, daysBetween } from "../../../lib/helpers";

export default function DashboardPage() {
  const { t, lang, currency, session } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [artworks, setArtworks] = useState([]);
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [exhibitions, setExhibitions] = useState([]);

  useEffect(() => {
    (async () => {
      const uid = session.user.id;
      const [a, s, e, c, ex] = await Promise.all([
        supabase.from("artworks").select("*").eq("user_id", uid),
        supabase.from("sales").select("*").eq("user_id", uid),
        supabase.from("expenses").select("*").eq("user_id", uid),
        supabase.from("commissions").select("*").eq("user_id", uid),
        supabase.from("exhibitions").select("*").eq("user_id", uid),
      ]);
      setArtworks(a.data || []); setSales(s.data || []); setExpenses(e.data || []);
      setCommissions(c.data || []); setExhibitions(ex.data || []);
      setLoading(false);
    })();
  }, [session]);

  if (loading) return <div style={{ color: "#8A8371" }}>Loading…</div>;

  const byStatus = STATUS_KEYS.reduce((acc, k) => { acc[k] = artworks.filter((a) => a.status === k).length; return acc; }, {});
  const totalRevenue = sales.reduce((s, x) => s + Number(x.net_revenue || 0), 0);
  const totalExpensesFlat = expenses.reduce((s, x) => s + Number(x.amount || 0), 0);
  const netProfit = totalRevenue - totalExpensesFlat - sales.reduce((s, x) => s + Number(x.cost || 0), 0);
  const inventoryValue = artworks.filter((a) => a.status !== "sold" && a.status !== "archived").reduce((s, a) => s + Number(a.suggested_price || 0), 0);
  const avgPrice = artworks.length ? artworks.reduce((s, a) => s + Number(a.suggested_price || 0), 0) / artworks.length : 0;
  const now = new Date();
  const salesThisMonth = sales.filter((s) => new Date(s.date).getMonth() === now.getMonth() && new Date(s.date).getFullYear() === now.getFullYear());
  const bestSeller = sales.length ? [...sales].sort((a, b) => b.price - a.price)[0] : null;
  const activeCommissions = commissions.filter((c) => !["completed", "cancelled"].includes(c.status));
  const overdueCommissions = activeCommissions.filter((c) => c.deadline && daysBetween(todayISO(), c.deadline) < 0);
  const currentExhibitions = exhibitions.filter((e) => e.start_date <= todayISO() && e.end_date >= todayISO());

  const alerts = [];
  overdueCommissions.forEach((c) => alerts.push(`${t.alerts.commissionOverdue}: ${c.title}`));
  activeCommissions.filter((c) => c.deadline && daysBetween(todayISO(), c.deadline) >= 0 && daysBetween(todayISO(), c.deadline) <= 7)
    .forEach((c) => alerts.push(`${t.alerts.commissionDue}: ${c.title}`));
  exhibitions.forEach((e) => { const d = daysBetween(todayISO(), e.end_date); if (d >= 0 && d <= 5) alerts.push(`${t.alerts.exhibitionEnding}: ${e.name}`); });
  artworks.forEach((a) => { if (!a.suggested_price && a.status !== "sold" && a.status !== "archived") alerts.push(`${t.alerts.noPrice}: ${a.title}`); });

  return (
    <div>
      <SectionTitle>{t.dashboard.overview}</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 26 }}>
        <StatTile label={t.dashboard.total} value={artworks.length} />
        {STATUS_KEYS.map((k) => byStatus[k] > 0 && <StatTile key={k} label={t.status[k]} value={byStatus[k]} />)}
      </div>

      <SectionTitle>{t.dashboard.financial}</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 26 }}>
        <StatTile label={t.dashboard.revenue} value={money(totalRevenue, currency, lang)} />
        <StatTile label={t.dashboard.expensesTotal} value={money(totalExpensesFlat, currency, lang)} />
        <StatTile label={t.dashboard.netProfit} value={money(netProfit, currency, lang)} />
        <StatTile label={t.dashboard.inventoryValue} value={money(inventoryValue, currency, lang)} />
        <StatTile label={t.dashboard.avgPrice} value={money(avgPrice, currency, lang)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 26 }}>
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>{t.nav.sales}</div>
          <Row label={t.dashboard.salesThisMonth} value={salesThisMonth.length} />
          <Row label={t.dashboard.bestSeller} value={bestSeller ? money(bestSeller.price, currency, lang) : t.dashboard.none} />
        </Card>
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>{t.nav.commissions}</div>
          <Row label={t.dashboard.activeCommissions} value={activeCommissions.length} />
          <Row label={t.dashboard.overdue} value={overdueCommissions.length} valueColor={overdueCommissions.length ? "#9A4A3E" : undefined} />
        </Card>
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>{t.nav.exhibitions}</div>
          <Row label={t.dashboard.currentExhibitions} value={currentExhibitions.length} />
        </Card>
      </div>

      <SectionTitle>{t.dashboard.alerts}</SectionTitle>
      <Card>
        {alerts.length === 0 ? <div style={{ color: "#8A8371", fontSize: 14 }}>{t.dashboard.noAlerts}</div> : alerts.map((a, i) => (
          <div key={i} style={{ padding: "8px 0", borderBottom: i < alerts.length - 1 ? "1px solid #F0EBDD" : "none", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#B08D57", flexShrink: 0 }} />{a}
          </div>
        ))}
      </Card>
    </div>
  );
}
