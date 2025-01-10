"use server";
// lib/auth/checkSession.ts
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function checkSession() {
  const supabase = await createClient();

  // Cookies asynchron abrufen
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;
  if (!sessionToken) {
    // Weiterleitung zur Login-Seite, wenn kein Token vorhanden ist
    console.log("session invalid");
    return false;
  }

  // Session-Token in der Datenbank prüfen
  const { data: session, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("token", sessionToken)
    .single();

  if (error || !session) {
    // Weiterleitung bei ungültigem Token oder wenn keine Session gefunden wurde
    console.log("session invalid");
    return false;
  }
  // Gültigkeit basierend auf Ablaufzeit prüfen
  const now = new Date();
  const expiresAt = new Date(session.expires_at);

  if (expiresAt < now) {
    // Weiterleitung bei abgelaufenem Token
    console.log("session invalid");
    return false;
  }

  // Session gültig, Anfrage fortsetzen
  return true;
}
