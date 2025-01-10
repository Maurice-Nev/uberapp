import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateOrUpdateRideForm } from "@/features/offer-ride/components/createOrUpdateRideForm";
import React from "react";

interface EditRideModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any;
}

export const EitRideModal = ({ open, setOpen, data }: EditRideModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-h-[50vh]  h-full overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Edit Ride</DialogTitle>
          <DialogDescription>
            Here you can edit the details of the ride.
          </DialogDescription>
        </DialogHeader>
        <div>
          {/* <pre>{JSON.stringify(data.original, null, 2)}</pre> */}
          <CreateOrUpdateRideForm
            onSuccess={() => setOpen(false)}
            defaultValues={data.original}
          />
        </div>
        <DialogFooter>
          {/* <Button type="button" onClick={() => setOpen(false)}>
            Close
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EitRideModal;
