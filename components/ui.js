"use client";
import React from "react";

export function Badge({ label, color }) {
  return (
    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, color: color === "#2B2925" ? "#EDE7D9" : "#2B2925", background: color }}>{label}</span>
  );
}

export function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ display: "block", fontSize: 12.5, color: "#6B655A", marginBottom: 5, fontWeight: 600 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #DDD6C4", background: "#FFFEFB", fontSize: 14.5, color: "#2B2925", fontFamily: "inherit", boxSizing: "border-box" };

export function Input(props) { return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />; }
export function Select(props) { return <select {...props} style={{ ...inputStyle, ...(props.style || {}) }}>{props.children}</select>; }
export function TextArea(props) { return <textarea {...props} style={{ ...inputStyle, minHeight: 70, resize: "vertical", ...(props.style || {}) }} />; }

export function Btn({ children, onClick, variant = "primary", style = {}, type = "button", disabled }) {
  const base = { padding: "10px 18px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: disabled ? "default" : "pointer", border: "1px solid transparent", fontFamily: "inherit", opacity: disabled ? 0.6 : 1 };
  const variants = {
    primary: { background: "#B08D57", color: "#FFFEFB" },
    dark: { background: "#2B2925", color: "#EDE7D9" },
    ghost: { background: "transparent", color: "#2B2925", border: "1px solid #DDD6C4" },
    danger: { background: "transparent", color: "#9A4A3E", border: "1px solid #E2C9C2" },
  };
  return <button type={type} disabled={disabled} onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
}

export function Card({ children, style = {} }) {
  return <div style={{ background: "#FFFEFB", border: "1px solid #EAE3D2", borderRadius: 14, padding: 20, ...style }}>{children}</div>;
}

export function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(43,41,37,0.45)", zIndex: 50, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "4vh 16px", overflowY: "auto" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#FBF8F1", borderRadius: 16, padding: 24, width: "100%", maxWidth: wide ? 720 : 480, marginTop: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6B655A" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function StatTile({ label, value, sub }) {
  return (
    <div style={{ padding: "16px 18px", background: "#FFFEFB", border: "1px solid #EAE3D2", borderRadius: 12, minWidth: 150, flex: "1 1 150px" }}>
      <div style={{ fontSize: 12, color: "#8A8371", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "#2B2925" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#8A8371", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export function SectionTitle({ children, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, marginTop: 4, flexWrap: "wrap", gap: 10 }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, margin: 0, position: "relative", paddingBottom: 8 }}>
        {children}
        <span style={{ position: "absolute", bottom: 0, insetInlineStart: 0, width: 42, height: 3, background: "#B08D57", borderRadius: 2 }} />
      </h2>
      {right}
    </div>
  );
}

export function EmptyState({ text, actionLabel, onAction }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "#8A8371" }}>
      <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 19, marginBottom: 16, color: "#5B564B" }}>{text}</div>
      {actionLabel && <Btn onClick={onAction}>{actionLabel}</Btn>}
    </div>
  );
}

export function Row({ label, value, valueColor }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13.5 }}>
      <span style={{ color: "#6B655A" }}>{label}</span>
      <span style={{ fontWeight: 600, color: valueColor }}>{value}</span>
    </div>
  );
}
