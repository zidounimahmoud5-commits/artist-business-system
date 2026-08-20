"use client";
import React from "react";
import Link from "next/link";
import { useApp } from "../../../components/AppContext";
import { SectionTitle, Card } from "../../../components/ui";

const ITEMS = [
  ["/pricing", "pricing"],
  ["/commissions", "commissions"],
  ["/exhibitions", "exhibitions"],
  ["/expenses", "expenses"],
  ["/contracts", "contracts"],
  ["/settings", "settings"],
];

export default function MorePage() {
  const { t } = useApp();
  return (
    <div>
      <SectionTitle>{t.nav.more}</SectionTitle>
      <Card style={{ padding: 0 }}>
        {ITEMS.map(([href, key], i) => (
          <Link key={href} href={href} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "16px 18px", textDecoration: "none", color: "#241F1A",
            fontSize: 15, fontWeight: 500,
            borderBottom: i < ITEMS.length - 1 ? "1px solid #EDE4D0" : "none",
          }}>
            <span>{t.nav[key]}</span>
            <span style={{ color: "#9C9280" }}>›</span>
          </Link>
        ))}
      </Card>
    </div>
  );
}
