import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import toast from "react-hot-toast";

export const useTicketScanner = ({
  onLoading,
  onSuccess,
  onError,
  verifyTicket,
  eventId,
}) => {
  const scannerRef = useRef(null);
  const hasScannedRef = useRef(false);
  const startedRef = useRef(false);

  const startScanner = () => {
    const element = document.getElementById("qr-reader");
    if (!element) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        if (hasScannedRef.current) return;
        hasScannedRef.current = true;

        onLoading();

        verifyTicket(
          { qrData: decodedText, eventId },
          {
            onSuccess: (data) => {
              onSuccess(data);
            },
            onError: (err) => {
              onError(
                err?.response?.data?.error?.message || "Verification failed"
              );
            },
            onSettled: () => {
              scannerRef.current?.clear().catch(() => {});
              scannerRef.current = null;
            },
          }
        );
      },
      (error) => {
        if (
          error?.includes("NotFoundException") ||
          error?.includes("No barcode or QR code detected")
        ) {
          return;
        }
        toast.warn(`QR error: ${error.message}`);
      }
    );
  };

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let rafId;

    rafId = requestAnimationFrame(startScanner);

    return () => {
      cancelAnimationFrame(rafId);
      scannerRef.current?.clear().catch(() => {});
      scannerRef.current = null;
      startedRef.current = false;
      hasScannedRef.current = false;
    };
  }, []);

  const scanAgain = () => {
    hasScannedRef.current = false;
    scannerRef.current?.clear().catch(() => {});
    scannerRef.current = null;
    requestAnimationFrame(startScanner);
  };

  return { scanAgain };
};
