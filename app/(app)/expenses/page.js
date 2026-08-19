"use client";
import React, { useEffect, useState } from "react";
import { useApp } from "../../../components/AppContext";
import { supabase } from "../../../lib/supabaseClient";
import { SectionTitle, Btn, Card, Field, Input, Select, TextArea, Modal, EmptyState } from "../../../components/ui";
import { EXPENSE_CATEGORY_KEYS } from "../../../lib/i18n";
import { money, todayISO } from "../../../lib/helpers";

export default function ExpensesPage() {
  const { t, lang, currency, session } = useApp();
  const e = t.expenses;
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState(false);

  async function loadAll() {
    const { data } = await supabase.from("expenses").select("*").eq("user_id", session.user.id).order("date", { ascending: false });
    setExpenses(data || []); setLoading(false);
  }
  useEffect(() => { loadAll(); }, [session]);
  if (loading) return <div style={{ color: "#8A8371" }}>Loading…</div>;

  return (
    <div>
      <SectionTitle right={<Btn onClick={() => setFormModal(true)}>{e.add}</Btn>}>{e.title}</SectionTitle>
      {expenses.length === 0 ? <EmptyState text={e.empty} actionLabel={e.add} onAction={() => setFormModal(true)} /> : (
        <Card style={{ padding: 0, overflowX: "auto" }}>
          <table>
            <thead><tr><th>{e.category}</th><th>{e.date}</th><th>{e.amount}</th><th>{e.notes}</th><th></th></tr></thead>
            <tbody>
              {expenses.map((x) => (
                <tr key={x.id}>
                  <td>{t.expenseCategory[x.category]}</td>
                  <td>{x.date}</td>
                  <td>{money(x.amount, currency, lang)}</td>
                  <td>{x.notes}</td>
                  <td><Btn variant="danger" style={{ padding: "4px 10px", fontSize: 12 }} onClick={async () => { await supabase.from("expenses").delete().eq("id", x.id).eq("user_id", session.user.id); loadAll(); }}>{t.common.delete}</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {formModal && (
        <Modal title={e.add} onClose={() => setFormModal(false)}>
          <ExpenseFormBody t={t} onSave={async (form) => {
            const uid = session.user.id;
            await supabase.from("expenses").insert({ ...form, user_id: uid });
            await supabase.from("activity_log").insert({ user_id: uid, action: "Expense added", object: t.expenseCategory[form.category] });
            setFormModal(false); loadAll();
          }} />
        </Modal>
      )}
    </div>
  );
}

function ExpenseFormBody({ t, onSave }) {
  const e = t.expenses;
  const [form, setForm] = useState({ category: "materials", amount: "", date: todayISO(), notes: "" });
  const [saving, setSaving] = useState(false);
  function set(k, v) { setForm({ ...form, [k]: v }); }
  return (
    <>
      <Field label={e.category}><Select value={form.category} onChange={(ev) => set("category", ev.target.value)}>{EXPENSE_CATEGORY_KEYS.map((k) => <option key={k} value={k}>{t.expenseCategory[k]}</option>)}</Select></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <Field label={e.amount}><Input type="number" value={form.amount} onChange={(ev) => set("amount", ev.target.value)} /></Field>
        <Field label={e.date}><Input type="date" value={form.date} onChange={(ev) => set("date", ev.target.value)} /></Field>
      </div>
      <Field label={e.notes}><TextArea value={form.notes} onChange={(ev) => set("notes", ev.target.value)} /></Field>
      <Btn disabled={saving} onClick={async () => { if (!form.amount) return; setSaving(true); await onSave(form); setSaving(false); }}>{e.save}</Btn>
    </>
  );
}
