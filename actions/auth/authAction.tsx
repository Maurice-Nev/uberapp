"use server";

import { createClient } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid"; // UUID für Token-Generierung

export async function signUpAction(data: any) {
  const supabase = await createClient();
  try {
    if (!data.password) {
      return { error: "Password is required." };
    }

    // Passwort hashen
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Benutzer registrieren
    const { data: user, error: signUpError } = await supabase
      .from("user")
      .insert([
        {
          name: data.username as string,
          email: data.email as string,
          password: hashedPassword,
        },
      ])
      .select()
      .single();

    if (signUpError) {
      console.error("Error during sign up:", signUpError);
      return { error: "Registration failed. Please try again." };
    }

    // Session-Token erstellen
    const sessionToken = uuidv4();

    // Session speichern
    const { error: sessionError } = await supabase.from("sessions").insert([
      {
        user_id: user.id,
        token: sessionToken,
      },
    ]);

    if (sessionError) {
      console.error("Error creating session:", sessionError);
      return { error: "Error creating session. Please try again." };
    }

    // Erfolgreiches Ergebnis zurückgeben
    return { user, token: sessionToken };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function signInAction(data: any) {
  const supabase = await createClient();

  try {
    // Benutzer basierend auf der E-Mail abrufen
    const { data: user, error: fetchError } = await supabase
      .from("user")
      .select("id, name, email, password")
      .eq("email", data.email)
      .single();

    if (fetchError || !user) {
      return { error: "User not found or incorrect credentials." };
    }

    // Passwort überprüfen
    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return { error: "Incorrect password." };
    }

    // Session-Token erstellen
    const sessionToken = uuidv4();

    // Session speichern
    const { error: sessionError } = await supabase.from("sessions").insert([
      {
        user_id: user.id,
        token: sessionToken,
      },
    ]);

    if (sessionError) {
      console.error("Error creating session:", sessionError);
      return { error: "Error creating session. Please try again later." };
    }

    // Erfolgreiche Antwort mit Session-Token zurückgeben
    return {
      user: { id: user.id, name: user.name, email: user.email },
      token: sessionToken,
    };
  } catch (error) {
    console.error("Error during sign in:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function getUserAction() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  if (!sessionToken) {
    console.error("sessionToken not set");
    return {
      success: false,
      message: "sessionToken not set",
    };
  }

  const supabase = await createClient();

  // Hole die Nutzerdaten aus der Datenbank
  const { data, error } = await supabase
    .from("sessions")
    .select("user_id")
    .eq("token", sessionToken)
    .single();

  if (error || !data) {
    console.error("user not found");
    return {
      success: false,
      message: "user not found",
    };
  }

  return {
    success: true,
    user_id: data.user_id, // Nur die user_id zurückgeben
  };
}

export async function getUserById({ user_id }: { user_id: string }) {
  const supabase = await createClient();
  const user = supabase.from("user").select().eq("id", user_id).single();

  return user;
}
