import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCheckSession, useGetUser } from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import {
  useCreateAssign,
  useDeleteAssign,
  useGetAssigns,
} from "@/hooks/assigns/useAssign";
import { Cigarette, CigaretteOff, Map, MapPinned } from "lucide-react";

export default function NearbyResults({
  nearbyResult,
  location,
}: {
  nearbyResult: any[];
  location: { latitude: string; longitude: string };
}) {
  const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);
  const router = useRouter();
  const { data: sessionIsValid, isLoading } = useCheckSession();
  const { mutate: assignMutation, isPending } = useCreateAssign({ location });

  const { mutate: deleteAssignMutation, isPending: isDeletingAssign } =
    useDeleteAssign({ location });
  const { data: assigns, isLoading: isLoadingAssigns } = useGetAssigns();
  const user = useGetUser();
  const handleCloseDialog = () => {
    setOpenDialogIndex(null); // Schließt den Dialog
  };
  const handleConfirm = (index: number, item: any) => {
    // setOpenDialogIndex(index);
    const isAssigned = assigns?.some(
      (assign: any) =>
        assign.ride_id === (item.ride_id ? item.ride_id : item.id) || false
    );

    if (sessionIsValid) {
      if (isAssigned) {
        deleteAssignMutation(
          { ride_id: item.ride_id ? item.ride_id : item.id },
          {
            onSuccess: (result) => {
              setOpenDialogIndex(index);
              if (result.error) {
                console.error(result.message);
              } else {
                handleCloseDialog();
              }
            },
          }
        );
      } else {
        assignMutation(
          { ride_id: item.ride_id ? item.ride_id : item.id },
          {
            onSuccess: (result) => {
              if (result.error) {
                console.error(result.message);
              } else {
                handleCloseDialog();
              }
            },
          }
        );
      }
    } else {
      router.push("/auth");
    }
  };

  const handleSetOpenDialogIndex = (index: any) => {
    sessionIsValid ? setOpenDialogIndex(index) : router.push("/auth");
  };

  const convertTimestamp = (timestamp: any) => {
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0]; // Gibt das Datum im Format 'yyyy-mm-dd' zurück
  };
  return (
    <>
      {nearbyResult &&
        nearbyResult.map((item: any, index: number) => {
          // Prüfen, ob die `ride_id` bereits in `assigns` enthalten ist
          const isAssigned =
            assigns?.some(
              (assign: any) =>
                assign.ride_id === (item.ride_id ? item.ride_id : item.id)
            ) || false;

          return (
            <div key={index} className="my-4">
              {/* <pre>{JSON.stringify(item, null, 2)}</pre> */}
              <div className="w-full rounded-lg border p-4 flex flex-col gap-2">
                <div className="flex justify-between">
                  <p>location: </p>
                  <p>
                    {item.smoking_allowed ? <Cigarette /> : <CigaretteOff />}
                  </p>
                </div>
                <p className="flex">
                  {item.start_location}
                  {/* <a
                    target="_blank"
                    href={`https://www.google.de/maps/${item.start_location}`}
                  >
                    {" "}
                    <MapPinned />
                  </a> */}
                </p>
                <p>Date: {convertTimestamp(item.departure_date)}</p>
                <p>Time: {item.departure_time} Uhr</p>
                <p>Seats Left: {item.available_seats}</p>
                <p>Additional Notes:</p>
                <p>{item.additional_notes}</p>
                <Dialog
                  open={openDialogIndex === index}
                  onOpenChange={(isOpen) => {
                    if (!isOpen) handleCloseDialog();
                  }}
                >
                  <DialogTrigger key={index} asChild>
                    <Button
                      variant={isAssigned ? "default" : "outline"}
                      onClick={() => handleSetOpenDialogIndex(index)}
                    >
                      {isAssigned ? "revoke " : "Assign"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Confirm</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to{" "}
                        {isAssigned ? "revoke this" : "assign for this?"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex w-full gap-4">
                      <Button
                        type="submit"
                        className="w-full"
                        variant={"outline"}
                        disabled={isPending}
                        onClick={() => {
                          handleConfirm(index, item);
                        }}
                      >
                        Yes
                      </Button>
                      <Button
                        className="w-full"
                        type="button"
                        onClick={handleCloseDialog}
                      >
                        No
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          );
        })}
    </>
  );
}
