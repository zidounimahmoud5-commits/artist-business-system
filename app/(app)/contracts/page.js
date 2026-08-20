"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useApp } from "../../../components/AppContext";
import { supabase } from "../../../lib/supabaseClient";
import { SectionTitle, Btn, Card, Field, Input, Select, TextArea, Modal, EmptyState } from "../../../components/ui";
import { money } from "../../../lib/helpers";

export default function ContractsPage() {
  const { t, lang, currency, session } = useApp();
  const c = t.contracts;
  const searchParams = useSearchParams();

  const [contracts, setContracts] = useState([]);
  const [clients, setClients] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState(null);

  async function loadAll() {
    const uid = session.user.id;
    const [ct, cl, cm] = await Promise.all([
      supabase.from("contracts").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("clients").select("*").eq("user_id", uid).order("name"),
      supabase.from("commissions").select("*").eq("user_id", uid),
    ]);
    setContracts(ct.data || []);
    setClients(cl.data || []);
    setCommissions(cm.data || []);
    setLoading(false);
  }
  useEffect(() => { loadAll(); }, [session]);

  useEffect(() => {
    const commissionId = searchParams.get("commission");
    if (commissionId && commissions.length > 0 && !formModal) {
      const cm = commissions.find((x) => x.id === commissionId);
      if (cm) setFormModal({ mode: "new", commissionId: cm.id });
    }
  }, [searchParams, commissions]);

  if (loading) return <div style={{ color: "#8A8371" }}>Loading…</div>;
  const clientMap = Object.fromEntries(clients.map((cl) => [cl.id, cl]));

  return (
    <div>
      <SectionTitle right={<Btn onClick={() => setFormModal({ mode: "new" })}>{c.add}</Btn>}>{c.title}</SectionTitle>

      {contracts.length === 0 ? (
        <EmptyState text={c.empty} actionLabel={c.add} onAction={() => setFormModal({ mode: "new" })} />
      ) : (
        <Card style={{ padding: 0, overflowX: "auto" }}>
          <table>
            <thead><tr><th>{c.party}</th><th>{c.subject}</th><th>{c.price}</th><th>{c.deadline}</th><th></th><th></th></tr></thead>
            <tbody>
              {contracts.map((ct) => {
                const cl = clientMap[ct.client_id];
                return (
                  <tr key={ct.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{cl?.name || "—"}</div>
                      <div style={{ fontSize: 12, color: "#9C9280" }}>{cl ? t.clientType[cl.type] : ""}</div>
                    </td>
                    <td>{ct.subject}</td>
                    <td>{money(ct.price, currency, lang)}</td>
                    <td>{ct.deadline || "—"}</td>
                    <td>
                      <Link href={`/contracts/${ct.id}`}>
                        <Btn variant="ghost" style={{ padding: "4px 10px", fontSize: 12 }}>{c.view}</Btn>
                      </Link>
                    </td>
                    <td>
                      <Btn variant="danger" style={{ padding: "4px 10px", fontSize: 12 }} onClick={async () => {
                        await supabase.from("contracts").delete().eq("id", ct.id).eq("user_id", session.user.id);
                        loadAll();
                      }}>{c.delete}</Btn>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {formModal && (
        <ContractForm
          t={t} clients={clients} commissions={commissions}
          initialCommissionId={formModal.commissionId}
          onClose={() => setFormModal(null)}
          onSave={async (form) => {
            const uid = session.user.id;
            await supabase.from("contracts").insert({ ...form, user_id: uid });
            await supabase.from("activity_log").insert({ user_id: uid, action: "Contract created", object: form.subject });
            loadAll();
          }}
        />
      )}
    </div>
  );
}

function ContractForm({ t, clients, commissions, initialCommissionId, onClose, onSave }) {
  const c = t.contracts;
  const startCommission = initialCommissionId ? commissions.find((m) => m.id === initialCommissionId) : null;

  const [clientId, setClientId] = useState(startCommission?.client_id || clients[0]?.id || "");
  const [commissionId, setCommissionId] = useState(initialCommissionId || "");
  const [form, setForm] = useState({
    subject: startCommission?.concept || startCommission?.title || "",
    size: startCommission?.size || "",
    medium: startCommission?.medium || "",
    deadline: startCommission?.deadline || "",
    price: startCommission?.price || "",
    deposit: startCommission?.deposit || "",
    terms: c.defaultTerms,
  });
  const [saving, setSaving] = useState(false);
  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  const clientCommissions = commissions.filter((m) => m.client_id === clientId);

  function applyCommission(id) {
    setCommissionId(id);
    const cm = commissions.find((m) => m.id === id);
    if (cm) {
      setForm((f) => ({
        ...f,
        subject: cm.concept || cm.title || f.subject,
        size: cm.size || f.size,
        medium: cm.medium || f.medium,
        deadline: cm.deadline || f.deadline,
        price: cm.price ?? f.price,
        deposit: cm.deposit ?? f.deposit,
      }));
    }
  }

  return (
    <Modal title={c.add} onClose={onClose} wide>
      {clients.length === 0 ? (
        <div style={{ color: "#9C9280" }}>{c.noClients}</div>
      ) : (
        <>
          <Field label={c.selectClient}>
            <Select value={clientId} onChange={(e) => { setClientId(e.target.value); setCommissionId(""); }}>
              {clients.map((cl) => <option key={cl.id} value={cl.id}>{cl.name} — {t.clientType[cl.type]}</option>)}
            </Select>
          </Field>

          <Field label={c.linkCommission}>
            <Select value={commissionId} onChange={(e) => applyCommission(e.target.value)}>
              <option value="">{c.noCommission}</option>
              {clientCommissions.map((m) => <option key={m.id} value={m.id}>{m.title || m.concept}</option>)}
            </Select>
          </Field>
          {commissionId && <div style={{ fontSize: 12.5, color: "#8A9A82", marginBottom: 14 }}>{c.autoFilled}</div>}

          <Field label={c.subject}><TextArea value={form.subject} onChange={(e) => set("subject", e.target.value)} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Field label={c.size}><Input value={form.size} onChange={(e) => set("size", e.target.value)} /></Field>
            <Field label={c.medium}><Input value={form.medium} onChange={(e) => set("medium", e.target.value)} /></Field>
            <Field label={c.price}><Input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} /></Field>
            <Field label={c.deposit}><Input type="number" value={form.deposit} onChange={(e) => set("deposit", e.target.value)} /></Field>
            <Field label={c.deadline}><Input type="date" value={form.deadline || ""} onChange={(e) => set("deadline", e.target.value)} /></Field>
          </div>
          <Field label={c.terms}><TextArea value={form.terms} onChange={(e) => set("terms", e.target.value)} style={{ minHeight: 110 }} /></Field>

          <Btn disabled={saving || !clientId} onClick={async () => {
            if (!form.subject || !clientId) return;
            setSaving(true);
            await onSave({
              client_id: clientId,
              commission_id: commissionId || null,
              subject: form.subject,
              size: form.size,
              medium: form.medium,
              deadline: form.deadline || null,
              price: form.price || 0,
              deposit: form.deposit || 0,
              terms: form.terms,
            });
            setSaving(false);
            onClose();
          }}>{c.save}</Btn>
        </>
      )}
    </Modal>
  );
}
