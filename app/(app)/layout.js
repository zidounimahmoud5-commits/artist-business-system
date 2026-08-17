"use client";
import React from "react";
import { AppProvider } from "../../components/AppContext";
import Shell from "../../components/Shell";

export default function AppLayout({ children }) {
  return (
    <AppProvider>
      <Shell>{children}</Shell>
    </AppProvider>
  );
}
