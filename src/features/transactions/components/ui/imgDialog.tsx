"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface ImagedialogProps {
  img: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Imagedialog({ img, open, onOpenChange }: ImagedialogProps) {
  console.log(img);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" h-1/2 z-50">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className=" w-full">
          {img && (
            <Image src={img} className=" object-cover" fill alt="Parts" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
