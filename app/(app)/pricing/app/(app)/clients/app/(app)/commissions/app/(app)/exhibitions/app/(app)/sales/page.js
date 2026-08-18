"use client";
import React, { useEffect, useState } from "react";
import { useApp } from "../../../components/AppContext";
import { supabase } from "../../../lib/supabaseClient";
import { SectionTitle, Btn, Card, EmptyState } from "../../../components/ui";
import { money, exportCsv } from "../../../lib/helpers";

export default function SalesPage() {
  const { t, lang, currency, session } = useApp();
  const s = t.sales;
  const [sales, setSales] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const uid = session.user.id;
      const [sl, aw, cl] = await Promise.all([
        supabase.from("sales").select("*").eq("user_id", uid).order("date", { ascending: false }),
        supabase.from("artworks").select("id,title").eq("user_id", uid),
        supabase.from("clients").select("id,name").eq("user_id", uid),
      ]);
      setSales(sl.data || []); setArtworks(aw.data || []); setClients(cl.data || []);
      setLoading(false);
    })();
  }, [session]);
  if (loading) return <div style={{ color: "#8A8371" }}>Loading…</div>;

  const artworkMap = Object.fromEntries(artworks.map((a) => [a.id, a]));
  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c]));

  return (
    <div>
      <SectionTitle right={sales.length > 0 && <Btn variant="ghost" onClick={() => exportCsv("sales.csv", sales.map((x) => ({
        artwork: artworkMap[x.artwork_id]?.title || x.artwork_id, buyer: clientMap[x.client_id]?.name || "", date: x.date, price: x.price, netRevenue: x.net_revenue, profit: x.profit,
      })))}>{s.exportCsv}</Btn>}>{s.title}</SectionTitle>
      {sales.length === 0 ? <EmptyState text={s.empty} /> : (
        <Card style={{ padding: 0, overflowX: "auto" }}>
          <table>
            <thead><tr><th>{s.artwork}</th><th>{s.buyer}</th><th>{s.date}</th><th>{s.price}</th><th>{s.net}</th><th>{s.profit}</th></tr></thead>
            <tbody>
              {sales.map((x) => (
                <tr key={x.id}>
                  <td>{artworkMap[x.artwork_id]?.title || x.artwork_id}</td>
                  <td>{clientMap[x.client_id]?.name || "—"}</td>
                  <td>{x.date}</td>
                  <td>{money(x.price, currency, lang)}</td>
                  <td>{money(x.net_revenue, currency, lang)}</td>
                  <td style={{ color: x.profit >= 0 ? "#5F8A5F" : "#9A4A3E", fontWeight: 700 }}>{money(x.profit, currency, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
