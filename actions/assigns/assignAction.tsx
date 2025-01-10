"use server";
import { createClient } from "@/lib/supabase/server";
import { getUserAction } from "../auth/authAction";

export async function createAssign({ ride_id }: { ride_id: string }) {
  const supabase = await createClient();
  const user = await getUserAction();

  if (!user.user_id || !ride_id) {
    return {
      error: true,
      message: "User id or Ride id was missing",
    };
  }

  // 1. Fahrt abfragen, um verfügbare Sitzplätze zu prüfen
  const { data: ride, error: rideError } = await supabase
    .from("rides")
    .select("available_seats")
    .eq("id", ride_id)
    .single();

  if (rideError || !ride) {
    return {
      error: true,
      message: `Error fetching ride: ${rideError?.message || "Ride not found"}`,
    };
  }

  // 2. Prüfen, ob noch Sitzplätze verfügbar sind
  const availableSeats = parseInt(ride.available_seats, 10); // Sitzplätze in Zahl umwandeln
  if (isNaN(availableSeats) || availableSeats <= 0) {
    return {
      error: true,
      message: "No available seats for this ride",
    };
  }

  // 3. Eintrag in der Tabelle `assigns` erstellen
  const { data: assign, error: assignError } = await supabase
    .from("assigns")
    .insert({
      user_id: user.user_id,
      ride_id: ride_id,
    })
    .select()
    .single();

  if (assignError) {
    return {
      error: true,
      message: `Error creating assign: ${assignError.message}`,
    };
  }

  // 4. Sitzplätze in der Tabelle `rides` aktualisieren
  const { error: updateError } = await supabase
    .from("rides")
    .update({ available_seats: (availableSeats - 1).toString() }) // Sitzplätze um 1 reduzieren
    .eq("id", ride_id);

  if (updateError) {
    return {
      error: true,
      message: `Error updating available seats: ${updateError.message}`,
    };
  }

  // 5. Erfolgreiche Anmeldung zurückgeben
  return {
    error: false,
    data: assign,
    message: "Successfully assigned to the ride",
  };
}

export async function deleteAssign({ ride_id }: { ride_id: string }) {
  const supabase = await createClient();

  const user = await getUserAction();
  if (!user.user_id || !ride_id) {
    return {
      error: true,
      message: "User id or ride id was missing",
    };
  }

  // 1. Löschen des Eintrags aus `assigns`
  const { data: deletedAssign, error: deleteError } = await supabase
    .from("assigns")
    .delete()
    .eq("ride_id", ride_id)
    .eq("user_id", user.user_id)
    .select()
    .single();

  if (deleteError) {
    return {
      error: true,
      message: `Error deleting assign: ${deleteError.message}`,
    };
  }

  // 2. Aktuelle Anzahl der Sitzplätze abrufen
  const { data: ride, error: rideError } = await supabase
    .from("rides")
    .select("available_seats")
    .eq("id", ride_id)
    .single();

  if (rideError || !ride) {
    return {
      error: true,
      message: `Error fetching ride: ${rideError?.message || "Ride not found"}`,
    };
  }

  // 3. Sitzplätze erhöhen
  const availableSeats = parseInt(ride.available_seats, 10);
  const { error: updateError } = await supabase
    .from("rides")
    .update({ available_seats: availableSeats + 1 }) // Sitzplätze um 1 erhöhen
    .eq("id", ride_id);

  if (updateError) {
    return {
      error: true,
      message: `Error updating available seats: ${updateError.message}`,
    };
  }

  // 4. Erfolgreiche Stornierung zurückgeben
  return {
    error: false,
    data: deletedAssign,
    message: "Successfully unassigned from the ride",
  };
}

export async function getAssigns() {
  const supabase = await createClient();
  const user = await getUserAction();

  if (user.user_id) {
    const { data, error } = await supabase
      .from("assigns")
      .select()
      .eq("user_id", user.user_id);

    return data;
  } else return [];
}

export async function getPassangers(): Promise<{
  error?: boolean;
  message?: string | null;
  passangers: any | [];
}> {
  const supabase = await createClient();
  const user = await getUserAction();

  if (user.user_id) {
    // Aktuelles Datum als ISO-String holen
    const today = new Date().toISOString();

    // 1. Holen der Fahrten des Hosts, die heute oder in der Zukunft liegen
    const { data: rides, error: ridesError } = await supabase
      .from("rides")
      .select()
      .eq("user_id", user.user_id)
      .gte("departure_date", today); // Nur zukünftige oder heutige Fahrten

    if (ridesError) {
      return {
        error: true,
        passangers: [],
        message: `Error fetching rides: ${ridesError.message}`,
      };
    }

    if (!rides || rides.length === 0) {
      return {
        error: false,
        passangers: [],
        message: "No upcoming rides found for this host.",
      };
    }

    // 2. Extrahiere alle `ride_id`s aus den Fahrten
    const rideIds = rides.map((ride) => ride.id);

    // 3. Holen aller Passagiere, die sich für diese Fahrten angemeldet haben,
    // und die zugehörigen `ride`-Details
    const { data: passangers, error: passangerError } = await supabase
      .from("assigns")
      .select("*, rides(*)") // Join mit `rides`-Tabelle
      .in("ride_id", rideIds);

    if (passangerError) {
      return {
        error: true,
        passangers: [],
        message: `Error fetching passangers: ${passangerError.message}`,
      };
    }

    // 4. Ergebnis zurückgeben
    return {
      error: false,
      message: null,
      passangers,
    };
  } else {
    return {
      error: true,
      passangers: [],
      message: "User not authenticated or user_id missing.",
    };
  }
}

export async function kickUser({
  user_id,
  ride_id,
}: {
  user_id: string;
  ride_id: string;
}) {
  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("assigns")
    .delete()
    .eq("user_id", user_id)
    .eq("ride_id", ride_id);

  if (deleteError) {
    return { error: deleteError };
  }
  const { data: originalRide, error: originalRideError } = await supabase
    .from("rides")
    .select()
    .eq("id", ride_id)
    .single();

  if (originalRideError) {
    return { error: originalRideError };
  }

  const result = await supabase
    .from("rides")
    .update({
      available_seats: JSON.stringify(Number(originalRide.available_seats) + 1),
    })
    .eq("id", ride_id)
    .select()
    .single();

  if (result.error) {
    return { error: result.error };
  }
  return result;
}
