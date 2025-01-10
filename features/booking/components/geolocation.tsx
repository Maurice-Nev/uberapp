"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetNearbyResults } from "@/hooks/geolocation/useNearbyResults";
import { useQueryClient } from "@tanstack/react-query";
import { MapPinCheckInside, MapPinX } from "lucide-react";
import { useEffect, useState } from "react";
import NearbyResults from "./result";

export default function GeolocationComponent() {
  const [location, setLocation] = useState<any>(null);
  const [destination, setDestination] = useState<string>("Cuno 1"); // Default-Wert
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(3); // Default-Wert

  const client = useQueryClient();
  const { data: nearbyResult, isLoading } = useGetNearbyResults({
    location,
    radius: JSON.stringify(radius),
    destination,
  });

  // Funktion, um die aktuelle Position des Nutzers zu laden
  const getLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        client.invalidateQueries({ queryKey: ["nearbyResult", location] });
        client.removeQueries({ queryKey: ["nearbyResult", null] });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  };

  // Initiale Standortbestimmung beim Laden der Seite
  useEffect(() => {
    getLocation(); // Lädt die aktuelle Position
  }, []); // Läuft nur einmal beim Laden der Seite

  // Aktualisiere die Query bei Radius-Änderungen
  useEffect(() => {
    if (location && radius !== null) {
      client.invalidateQueries({ queryKey: ["nearbyResult", location] });
    }
  }, [radius, client, location]);

  // Aktualisiere die Query bei Destination-Änderungen
  useEffect(() => {
    if (location && destination !== null) {
      client.invalidateQueries({ queryKey: ["nearbyResult", location] });
    }
  }, [destination, client, location]);

  // Slider-Wert ändern
  const handleRadiusChange = (value: number[]) => {
    setRadius(value[0]);
  };

  // Zielort ändern
  const handleDestinationChange = (value: string) => {
    setDestination(value);
  };

  return (
    <div>
      <div className="flex md:flex-row md:gap-4 gap-8 flex-col md:items-center mb-12">
        {/* {!location && (
          <Button variant={"outline"} onClick={getLocation}>
            Get current location
          </Button>
        )} */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div>
                {location ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.google.de/maps/place/${location.latitude}+${location.longitude}`}
                  >
                    <MapPinCheckInside />
                  </a>
                ) : (
                  <MapPinX />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div>
                {location ? (
                  <p>Check your approximated location</p>
                ) : (
                  <p>Your location is unknown</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Select
          onValueChange={handleDestinationChange}
          defaultValue="Cuno 1" // Standardzielort
        >
          <SelectTrigger className="md:w-[180px] w-full">
            <SelectValue placeholder="Select a destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Cuno 1">Cuno 1</SelectItem>
              <SelectItem value="Cuno 2">Cuno 2</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Slider
          className="md:w-96"
          defaultValue={[3]} // Standardradius
          max={10}
          step={0.2}
          onValueChange={handleRadiusChange}
        />
        <p>Radius: {radius} km</p>
      </div>
      {error && <p className="">Error: {error}</p>}
      {loading || isLoading ? <p>Loading...</p> : null}

      <NearbyResults location={location} nearbyResult={nearbyResult} />
      {/* {nearbyResult && <pre>{JSON.stringify(nearbyResult, null, 2)}</pre>} */}
    </div>
  );
}
