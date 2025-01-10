import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function TimePicker({ onChange }: any) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const times = Array.from({ length: 24 }, (_, hour) =>
    Array.from({ length: 2 }, (_, half) => {
      const minute = half * 30;
      return `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
    })
  ).flat();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{selectedTime || "Select Time"}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2">
        <div className="space-y-1">
          {times.map((time) => (
            <Button
              key={time}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setSelectedTime(time);
                onChange(time); // Gibt die ausgewählte Zeit zurück
              }}
            >
              {time}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default TimePicker;
