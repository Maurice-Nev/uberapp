"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserAction } from "../auth/authAction";

export async function GetNearbyResults({
  location,
  radius,
  destination,
}: {
  location: { latitude: string; longitude: string };
  radius: string;
  destination: "Cuno 1" | "Cuno 2";
}) {
  const supabase = await createClient();
  const user = await getUserAction();
  // Aktuelles Datum im ISO-Format (z. B. '2025-01-06')
  const today = new Date().toISOString().split("T")[0];

  if (location) {
    const { data, error } = await supabase
      .rpc("find_rides_within_radius", {
        user_lat: parseFloat(location.latitude),
        user_lon: parseFloat(location.longitude),
        radius: parseFloat(radius),
      })
      .order("start_distance", { ascending: true, nullsFirst: true })
      .eq("destination", destination)

      .neq("user_id", user.user_id)
      .gte("departure_date", today) // Filter für heute oder zukünftige Daten
      .gt("available_seats", 0); // Filter für verfügbare Sitzplätze > 0

    if (error) {
      console.error("Error fetching results:", error);
      return null;
    }

    return data;
  } else {
    const { data, error } = await supabase
      .from("rides")
      .select()
      .eq("destination", destination)
      .neq("user_id", user.user_id)
      .gte("departure_date", today)
      .gt("available_seats", 0); // Filter für verfügbare Sitzplätze > 0

    if (error) {
      console.error("Error fetching fallback results:", error);
      return null;
    }

    return data;
  }
}
