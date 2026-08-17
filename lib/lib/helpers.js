export function money(n, currency, lang) {
  const num = Number(n || 0);
  const formatted = num.toLocaleString(lang === "ar" ? "ar-DZ" : "en-US", { maximumFractionDigits: 2 });
  return lang === "ar" ? `${formatted} ${currency}` : `${currency} ${formatted}`;
}

export function calcArtworkCost(a) {
  return (
    Number(a.material_cost || 0) +
    Number(a.labor_hours || 0) * Number(a.labor_rate || 0) +
    Number(a.frame_cost || 0) +
    Number(a.packaging_cost || 0) +
    Number(a.shipping_cost || 0) +
    Number(a.other_costs || 0)
  );
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

export function exportCsv(filename, rows) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
