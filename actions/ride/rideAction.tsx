"use server";

import { createClient } from "@/lib/supabase/server";
import { getPassangers, kickUser } from "../assigns/assignAction";

export async function createRideAction(data: any) {
  const validateLocation = async (location: any) => {
    try {
      // console.log(location);
      const response = await fetch(
        `http://localhost:8080/search?q=${encodeURIComponent(
          String(location).trim()
        )}&format=json`
      );

      if (!response.ok) {
        console.error(`Fetch error: ${response.status} ${response.statusText}`);
        return null;
      }

      const results = await response.json();
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error("Error in validateLocation function:", error);
      return null; // Fehlerhafte Validierung, daher null zurückgeben
    }
  };

  // Überprüfen, ob beide Orte gefunden wurden
  const startLocationResult = await validateLocation(data.data.startLocation);
  // const destinationResult = await validateLocation(data.data.destination);

  if (!startLocationResult) {
    return {
      success: false,
      message:
        "Invalid start or destination location. Please check your input.",
      fieldErrors: {
        startLocation: !startLocationResult ? "Start location not found." : "",
        // destination: !destinationResult ? "Destination not found." : "",
      },
    };
  }

  const rideData = {
    startLocation: startLocationResult.display_name,
    destination: data.data.destination,
    coordinates: {
      start: { lat: startLocationResult.lat, lon: startLocationResult.lon },
      // destination: { lat: destinationResult.lat, lon: destinationResult.lon },
    },
    departureDate: data.data.departureDate,
    departureTime: data.data.departureTime,
    availableSeats: data.data.availableSeats,
    smokingAllowed: data.data.smokingAllowed,
    additionalNotes: data.data.additionalNotes,
    user_id: data.data.user_id,
  };

  return { success: true, rideData };
}

export async function saveRidedAction(data: any) {
  const supabase = await createClient();
  // console.log(data);
  try {
    const res = await supabase
      .from("rides")
      .insert([
        {
          start_location: data.startLocation,
          destination: data.destination,
          start_coordinates: data.coordinates.start,
          departure_date: data.departureDate,
          departure_time: data.departureTime,
          available_seats: data.availableSeats,
          orig_available_seats: data.availableSeats,
          smoking_allowed: data.smokingAllowed,
          additional_notes: data.additionalNotes,
          user_id: data.user_id,
        },
      ])
      .select()
      .single();
    if (res) {
      return {
        success: true,
        data: res,
      };
    } else {
      return {
        success: false,
        message: "error saving ride",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error in saveRideAction" + error,
    };
  }
}

export async function updateRidedAction({
  id,
  data,
}: {
  id: string;
  data: any;
}) {
  const supabase = await createClient();
  // console.log(data);
  try {
    const passangers = await getPassangers();
    if (!passangers || !passangers.passangers) {
      return {
        success: false,
        message: "Error in saveRideAction",
      };
    }
    const passangersForThisRide = passangers.passangers
      ? passangers.passangers.filter(
          (passanger: any) => passanger.ride_id === id
        )
      : 0;
    const updatedAvailableSeats =
      data.availableSeats -
      (passangersForThisRide != 0
        ? passangersForThisRide.length
        : passangersForThisRide);

    // return updatedAvailableSeats;

    if (updatedAvailableSeats < 0) {
      passangersForThisRide != 0 &&
        passangersForThisRide.map((passanger: any, index: number) => {
          if (index + 1 > data.availableSeats) {
            const res = kickUser({ user_id: passanger.user_id, ride_id: id });
            return res;
          }
        });
    }
    const revalidatedPassangerList = await revalidateDamnPassangers({
      id: id,
      seats: data.availableSeats,
    });
    const res = await supabase
      .from("rides")
      .update([
        {
          start_location: data.startLocation,
          destination: data.destination,
          start_coordinates: data.coordinates.start,
          departure_date: data.departureDate,
          departure_time: data.departureTime,
          available_seats: revalidatedPassangerList.seats,
          orig_available_seats: data.availableSeats,
          smoking_allowed: data.smokingAllowed,
          additional_notes: data.additionalNotes,
          user_id: data.user_id,
        },
      ])
      .eq("id", id)
      .select()
      .single();
    if (res) {
      return {
        success: true,
        data: res,
      };
    } else {
      return {
        success: false,
        message: "error saving ride",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error in updateRideAction" + error,
    };
  }
}

export async function getRideAction({ user_id }: { user_id: string }) {
  const supabase = await createClient();
  const res = supabase
    .from("rides")
    .select()
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  return res;
}

export async function revalidateDamnPassangers({
  id,
  seats,
}: {
  id: string;
  seats: number;
}): Promise<{
  seats: number | null;
  error: string | null;
}> {
  try {
    const passangers = await getPassangers();
    if (!passangers || !passangers.passangers) throw "Did not get passangers";

    const passangersForThisRide = passangers.passangers
      ? passangers.passangers.filter(
          (passanger: any) => passanger.ride_id === id
        )
      : 0;

    const updatedAvailableSeats =
      seats -
      (passangersForThisRide != 0
        ? passangersForThisRide.length
        : passangersForThisRide);

    return { seats: updatedAvailableSeats, error: null };
  } catch (error) {
    return { seats: null, error: error as string };
  }
}
