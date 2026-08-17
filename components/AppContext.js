"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { DICT } from "../lib/i18n";

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const router = useRouter();
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
  const [profile, setProfile] = useState(null);

  async function loadProfile(userId) {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    setProfile(data);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      if (data.session) loadProfile(data.session.user.id);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      if (sess) loadProfile(sess.user.id);
      else setProfile(null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === null) router.replace("/login");
  }, [session, router]);

  async function refreshProfile() {
    if (session) await loadProfile(session.user.id);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  const lang = profile?.language || "en";
  const t = DICT[lang];
  const currency = profile?.currency || "USD";

  if (session === undefined || (session && !profile)) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#8A8371", fontFamily: "sans-serif" }}>Loading…</div>;
  }
  if (session === null) return null; // redirecting

  return (
    <AppCtx.Provider value={{ session, profile, refreshProfile, logout, lang, t, currency }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
