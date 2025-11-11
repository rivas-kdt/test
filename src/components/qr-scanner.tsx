// "use client"

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
// import "../app/globals.css";

interface QrScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QrScanner({ onScan, onClose }: QrScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scanErrorCount = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let scanner: Html5Qrcode | null = null;
    const qrCodeId = "qr-reader";

    const startScanner = async () => {
      try {
        if (!containerRef.current) return;

        containerRef.current.innerHTML = ""; // Clear any existing content

        const qrContainer = document.createElement("div");
        qrContainer.id = qrCodeId;
        qrContainer.style.width = "100%";
        qrContainer.style.height = "100%";
        qrContainer.style.objectFit = "cover"; // Ensure the video fills the container
        containerRef.current.appendChild(qrContainer);

        scanner = new Html5Qrcode(qrCodeId);
        scannerRef.current = scanner;

        // Wait for camera to fully initialize
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            // qrbox: (viewfinderWidth, viewfinderHeight) => {
            //   const size = Math.min(viewfinderWidth, viewfinderHeight) * 0.75; // Dynamic size
            //   return { width: size, height: size }; // Apply class for styling
            // },
            disableFlip: false, // Ensures QR code is not mirrored
            aspectRatio: 1, // Adjust aspect ratio if necessary (optional)
          },
          (decodedText) => {
            setIsScanning(false);

            if (scanner?.isScanning) {
              scanner
                .stop()
                .then(() => onScan(decodedText))
                .catch((error) => {
                  console.error("Error stopping scanner after scan:", error);
                  onScan(decodedText); // Still call onScan even if stopping fails
                });
            } else {
              onScan(decodedText);
            }
          },
          (errorMessage) => {
            // Limit scan error logging to avoid console spam
            if (scanErrorCount.current < 5) {
              console.log("Scan error:", errorMessage);
              scanErrorCount.current += 1;
            }
          }
        );

        setIsScanning(true);
      } catch (err) {
        console.error("Error starting QR scanner:", err);
        setError(
          "Unable to access camera. Please ensure you have granted camera permissions."
        );
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current
          .stop()
          .catch((error) =>
            console.error("Error stopping scanner during cleanup:", error)
          );
      }
    };
  }, [onScan]);

  const handleClose = () => {
    setIsScanning(false);

    if (scannerRef.current?.isScanning) {
      scannerRef.current
        .stop()
        .then(() => onClose())
        .catch((error) => {
          console.error("Error stopping scanner on close:", error);
          onClose();
        });
    } else {
      onClose();
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-0 right-0 z-10"
        onClick={handleClose}
      >
        <X className="h-6 w-6 text-white" />
      </Button>

      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-sm aspect-square overflow-hidden flex items-center justify-center">
          {" "}
          {/* border-2 border-dashed border-primary rounded-lg*/}
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
              <p className="text-destructive">{error}</p>
            </div>
          ) : (
            <div
              ref={containerRef}
              className="w-full h-full flex items-center justify-center"
            />
          )}
          {/* Overlay scanning frame */}
          {/* <div className="absolute pointer-events-none w-3/4 h-3/4 border-2 border-primary"></div> */}
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Position the QR code within the frame to scan
        </p>
      </div>
    </div>
  );
}
