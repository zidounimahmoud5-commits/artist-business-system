"use client";
import React from "react";

const INK = "#241F1A";
const INK_DARK = "#1E1A16";
const GOLD = "#A47C3E";
const GOLD_DEEP = "#8C6530";
const SURFACE = "#FFFDF9";
const SURFACE_ALT = "#FBF7EF";
const BORDER = "#EDE4D0";
const TEXT_MUTED = "#9C9280";
const TEXT_SECONDARY = "#6B6155";
const DANGER = "#8F4436";
const DANGER_BORDER = "#E5CFC5";

export function Badge({ label, color }) {
  return (
    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, color: color === INK_DARK ? "#EDE7D9" : INK, background: color }}>{label}</span>
  );
}

export function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ display: "block", fontSize: 12.5, color: TEXT_SECONDARY, marginBottom: 5, fontWeight: 600 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, background: SURFACE, fontSize: 14.5, color: INK, fontFamily: "inherit", boxSizing: "border-box" };

export function Input(props) { return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />; }
export function Select(props) { return <select {...props} style={{ ...inputStyle, ...(props.style || {}) }}>{props.children}</select>; }
export function TextArea(props) { return <textarea {...props} style={{ ...inputStyle, minHeight: 70, resize: "vertical", ...(props.style || {}) }} />; }

export function Btn({ children, onClick, variant = "primary", style = {}, type = "button", disabled }) {
  const base = { padding: "10px 18px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: disabled ? "default" : "pointer", border: "1px solid transparent", fontFamily: "inherit", opacity: disabled ? 0.6 : 1, transition: "background 0.15s ease" };
  const variants = {
    primary: { background: GOLD, color: "#FFFDF9" },
    dark: { background: INK_DARK, color: "#EDE7D9" },
    ghost: { background: "transparent", color: INK, border: `1px solid ${BORDER}` },
    danger: { background: "transparent", color: DANGER, border: `1px solid ${DANGER_BORDER}` },
  };
  return <button type={type} disabled={disabled} onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
}

export function Card({ children, style = {} }) {
  return <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20, ...style }}>{children}</div>;
}

export function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(30,26,22,0.5)", zIndex: 50, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "4vh 16px", overflowY: "auto" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: SURFACE_ALT, borderRadius: 16, padding: 24, width: "100%", maxWidth: wide ? 720 : 480, marginTop: 20, boxShadow: "0 20px 60px rgba(30,20,10,0.28)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 600, color: INK }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: TEXT_SECONDARY }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function StatTile({ label, value, sub }) {
  return (
    <div style={{ padding: "16px 18px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, minWidth: 150, flex: "1 1 150px" }}>
      <div style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: INK }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export function SectionTitle({ children, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, marginTop: 4, flexWrap: "wrap", gap: 10 }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, margin: 0, position: "relative", paddingBottom: 10, color: INK }}>
        {children}
        <span style={{ position: "absolute", bottom: 0, insetInlineStart: 0, width: 54, height: 2, backgroundImage: `linear-gradient(to right, ${GOLD_DEEP}, ${GOLD})`, borderRadius: 2 }} />
      </h2>
      {right}
    </div>
  );
}

export function EmptyState({ text, actionLabel, onAction }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: TEXT_MUTED }}>
      <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 19, marginBottom: 16, color: TEXT_SECONDARY }}>{text}</div>
      {actionLabel && <Btn onClick={onAction}>{actionLabel}</Btn>}
    </div>
  );
}

export fu
