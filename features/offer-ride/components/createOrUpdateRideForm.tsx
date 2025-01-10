"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import TimePicker from "@/components/ui/timePicker";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useCreateRide,
  useSaveRide,
  useUpdateRide,
} from "@/hooks/ride/useRide";
import { useGetUser } from "@/hooks/auth/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormSchema = z.object({
  startLocation: z.string().min(2, {
    message: "Start location must be at least 2 characters.",
  }),
  // destination: z.string().min(2, {
  //   message: "Destination must be at least 2 characters.",
  // }),
  destination: z.enum(["Cuno 1", "Cuno 2"]),
  departureDate: z.date({
    required_error: "Please enter a valid departure date.",
  }),
  departureTime: z
    .string()
    .regex(/^\d{4}$/, {
      message: "Please enter a valid departure time in HHMM format.",
    })
    .refine(
      (time) => {
        const hours = parseInt(time.slice(0, 2));
        const minutes = parseInt(time.slice(2, 4));
        return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
      },
      {
        message:
          "Please enter a valid time (HHMM) with hours between 00-23 and minutes between 00-59.",
      }
    ),
  availableSeats: z
    .string()
    .min(1, { message: "At least 1 seat must be available." })
    .max(1, { message: "Maximum of 9 seats allowed." }),
  smokingAllowed: z.boolean(),
  additionalNotes: z.string().optional(),
  user_id: z.string().optional(),
});

interface CreateOrUpdateRideFormProps {
  defaultValues?: any;
  onSuccess?: () => void;
}

export function CreateOrUpdateRideForm({
  defaultValues,
  onSuccess,
}: CreateOrUpdateRideFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues
      ? {
          startLocation: defaultValues.start_location || "",
          destination: defaultValues.destination || "Cuno 1",
          departureDate: new Date(defaultValues.departure_date) || undefined,
          departureTime: defaultValues.departure_time.replace(":", "") || "",
          availableSeats: defaultValues.orig_available_seats || "1",
          smokingAllowed: defaultValues.smoking_allowed || false,
          additionalNotes: defaultValues.additional_notes || "",
        }
      : {
          startLocation: "",
          destination: "Cuno 1",
          departureDate: undefined,
          departureTime: "",
          availableSeats: "1",
          smokingAllowed: false,
          additionalNotes: "",
        },
  });
  const router = useRouter();
  const [validatyChecked, setValidatyChecked] = useState<boolean>(false);

  const [ride, setRide] = useState<any>();
  const { mutate: useCreateRideMutation, isPending: isLoading } =
    useCreateRide();

  const { data: userData, isLoading: isLoadingUser } = useGetUser();
  const { mutate: saveRideMutation, isPending: isSavingRide } = useSaveRide();

  const { mutate: updateRideMutation, isPending: isUpdatingRide } =
    useUpdateRide();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const formattedTime = `${data.departureTime.slice(
      0,
      2
    )}:${data.departureTime.slice(2, 4)}`;
    data.departureTime = formattedTime;

    data.user_id = userData?.user_id;
    if (!validatyChecked) {
      useCreateRideMutation(
        { data },
        {
          onSuccess: (result) => {
            // Überprüfe, ob die Validierung erfolgreich war
            if (!result.success) {
              // Setze spezifische Feldfehler bei ungültiger Location
              if (result.fieldErrors?.startLocation) {
                form.setError("startLocation", {
                  message: result.fieldErrors.startLocation,
                });
              }
              // if (result.fieldErrors?.destination) {
              //   form.setError("destination", {
              //     message: result.fieldErrors.destination,
              //   });
              // }

              // Zeige Fehler-Toast an
              toast({
                title: "Location Error",
                description: result.message,
                variant: "destructive",
              });
              return;
            }

            if (result.success) {
              setValidatyChecked(true);
              setRide(result.rideData);
              console.log(result);
              // form.setValue("destination", result.rideData?.destination);
              form.setValue("startLocation", result.rideData?.startLocation);
            }

            // Erfolgstoast und Log für erfolgreiche Erstellung der Fahrt
            // console.log("Ride created:", result.rideData);
            toast({
              title: "Ride Created Successfully",
              description: "Your ride has been successfully created.",
              variant: "default",
            });
          },
          onError: (error) => {
            // Fehler während der Mutation behandeln
            console.error("Error creating ride:", error);
            toast({
              title: "Submission Error",
              description: "There was an error submitting your ride.",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      if (!defaultValues) {
        saveRideMutation(ride, {
          onSuccess: (result) => {
            if (result.success) {
              toast({
                title: "Success",
                description: <pre>{JSON.stringify(result.data, null, 2)}</pre>,
              });
              router.push("/my-rides");
            } else {
              toast({
                title: "Location Error",
                description: (
                  <pre>{JSON.stringify(result.message, null, 2)}</pre>
                ),
                variant: "destructive",
              });
            }
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: <pre>{JSON.stringify(error, null, 2)}</pre>,
              variant: "destructive",
            });
          },
        });
      } else {
        updateRideMutation(
          { id: defaultValues.id, data: ride },
          {
            onSuccess: (result) => {
              if (result.success) {
                toast({
                  title: "Success",
                  description: (
                    <pre>{JSON.stringify(result.data, null, 2)}</pre>
                  ),
                });
                onSuccess && onSuccess();
                // router.push("/my-rides");
              } else {
                toast({
                  title: "Location Error",
                  description: (
                    <pre>{JSON.stringify(result.message, null, 2)}</pre>
                  ),
                  variant: "destructive",
                });
              }
            },
            onError: (error) => {
              toast({
                title: "Error",
                description: <pre>{JSON.stringify(error, null, 2)}</pre>,
                variant: "destructive",
              });
            },
          }
        );
      }
    }
  }

  return (
    <Form {...form}>
      {/* <h1 className="text-4xl pb-8 md:hidden text-left">Create a ride</h1> */}
      {isLoadingUser === false && userData?.success === false ? (
        <div className="bg-red-300 w-full px-2 py-4 md:px-0">
          {userData.message}
        </div>
      ) : null}
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="startLocation"
          // disabled={validatyChecked}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Location</FormLabel>
              <FormControl>
                <Input placeholder="Start location" {...field} />
              </FormControl>
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="destination"
          // disabled={validatyChecked}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination</FormLabel>
              <FormControl>
                <Input placeholder="Destination" {...field} />
              </FormControl>
              </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Cuno 1">Cuno 1</SelectItem>
                  <SelectItem value="Cuno 2">Cuno 2</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {/* Departure Date Field with Calendar Picker */}
        <FormField
          control={form.control}
          name="departureDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Departure Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full pl-3 text-left font-normal"
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />

        {/* Departure Time Field with Time Picker */}
        <FormField
          control={form.control}
          name="departureTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departure Time</FormLabel>
              <FormControl>
                <InputOTP maxLength={4} {...field}>
                  <InputOTPGroup>
                    {/* Stundenfelder */}
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    {/* Minutenfelder */}
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the time in 24-hour format (HHMM).
              </FormDescription>
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="availableSeats"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Seats</FormLabel>
              <FormControl>
                <Input type="number" min={1} max={9} {...field} />
              </FormControl>
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="smokingAllowed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <FormLabel className="font-normal">Smoking Allowed</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Input placeholder="Any additional information" {...field} />
              </FormControl>
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />

        <div className="w-full flex justify-end">
          {isLoading === true || isLoadingUser === true ? (
            <Button disabled type="submit">
              <Skeleton className="h-4 w-16" />
            </Button>
          ) : validatyChecked === true ? (
            <Button type="submit" disabled={isSavingRide}>
              Save
            </Button>
          ) : (
            <Button type="submit" disabled={isSavingRide}>
              Check validity
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
