"use client";
import React, { useEffect, useState } from "react";
import { Phone, User, Clock } from "lucide-react";
import { useApp } from "../../../components/AppContext";
import { supabase } from "../../../lib/supabaseClient";
import { SectionTitle, Card, Btn, Badge, EmptyState } from "../../../components/ui";

const TEXT = {
  ar: { title: "طلبات البوابة", empty: "لا توجد طلبات من العملاء بعد.", newBadge: "جديد", seenBadge: "تمت المعالجة", markSeen: "وضع علامة (تمت المعالجة)", delete: "حذف", method: "الطريقة", note: "ملاحظة/مرجع التحويل", noNote: "—" },
  en: { title: "Portal requests", empty: "No client requests yet.", newBadge: "New", seenBadge: "Handled", markSeen: "Mark as handled", delete: "Delete", method: "Method", note: "Note / transfer reference", noNote: "—" },
};

export default function PortalRequestsPage() {
  const { lang, session, t } = useApp();
  const s = TEXT[lang];
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await supabase.from("portal_requests").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false });
    setRequests(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, [session]);

  async function markSeen(id) {
    await supabase.from("portal_requests").update({ status: "seen" }).eq("id", id).eq("user_id", session.user.id);
    load();
  }
  async function remove(id) {
    await supabase.from("portal_requests").delete().eq("id", id).eq("user_id", session.user.id);
    load();
  }

  if (loading) return <div style={{ color: "#8A8371" }}>Loading…</div>;

  return (
    <div>
      <SectionTitle>{s.title}</SectionTitle>
      {requests.length === 0 ? (
        <EmptyState text={s.empty} />
      ) : (
        requests.map((r) => (
          <Card key={r.id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 10, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <User size={16} color="#8C6530" strokeWidth={1.8} />
                <span style={{ fontWeight: 700, fontSize: 15 }}>{r.client_name}</span>
                <Badge label={t.paymentMethod?.[r.method] || r.method} color="#EDE4D0" />
              </div>
              <Badge label={r.status === "new" ? s.newBadge : s.seenBadge} color={r.status === "new" ? "#B08D57" : "#C9C4B8"} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#6B6155", marginBottom: 6 }}>
              <Phone size={14} color="#9C9280" strokeWidth={1.8} />
              <a href={`tel:${r.client_phone}`} style={{ color: "#6B6155" }}>{r.client_phone}</a>
            </div>
            {r.message && (
              <div style={{ fontSize: 13.5, color: "#6B6155", marginBottom: 8, background: "#FBF7EF", borderRadius: 8, padding: "8px 10px" }}>
                {r.message}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9C9280", marginBottom: 12 }}>
              <Clock size={13} strokeWidth={1.8} />
              {new Date(r.created_at).toLocaleString(lang === "ar" ? "ar" : "en")}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {r.status === "new" && <Btn variant="ghost" onClick={() => markSeen(r.id)}>{s.markSeen}</Btn>}
              <Btn variant="danger" onClick={() => remove(r.id)}>{s.delete}</Btn>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
