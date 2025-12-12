"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";

interface ImagePreviewDialogProps {
  open: boolean;
  imgUrl: string | null;
  onClose: () => void;
}

export function ImagePreviewDialog({
  open,
  imgUrl,
  onClose,
}: ImagePreviewDialogProps) {
  if (!imgUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay />

      <DialogContent
        showCloseButton={false}
        className="
          fixed left-1/2 top-1/2 z-50
          -translate-x-1/2 -translate-y-1/2
          w-[90vw] max-w-[950px] max-h-[90vh]
          bg-background/70 backdrop-blur-xl p-6
          rounded-xl shadow-2xl border border-white/15
          flex flex-col gap-4
        "
      >
        {/* REQUIRED for accessibility */}
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Image Preview</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>

        {/* CLOSE BUTTON */}
        <Button
          variant="outline"
          size="icon"
          onClick={onClose}
          className="
            absolute right-6 top-6 z-[999]
            rounded-full bg-background/80
            backdrop-blur-sm border border-white/30
            hover:bg-background
          "
        >
          <X className="w-5 h-5" />
        </Button>

        {/* IMAGE ZOOM CONTAINER */}
        <div className="flex items-center justify-center w-full h-full overflow-hidden rounded-lg">
          <TransformWrapper>
            <TransformComponent>
              <img
                src={imgUrl}
                alt="Preview"
                className="
                  max-w-full max-h-[80vh]
                  object-contain mx-auto rounded-lg
                "
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
}
