import { useCallback, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import toast from "react-hot-toast";

export const useTicketScanner = ({
  onLoading,
  onSuccess,
  onError,
  verifyTicket,
  eventId,
}) => {
  const qrRef = useRef(null);
  const hasScannedRef = useRef(false);
  const isRunningRef = useRef(false);

  const stopScanner = async () => {
    if (qrRef.current && isRunningRef.current) {
      try {
        await qrRef.current.stop();
      } catch {
        /* empty */
      }

      try {
        await qrRef.current.clear();
      } catch {
        /* empty */
      }

      isRunningRef.current = false;
      qrRef.current = null;
    }
  };

  const startScanner = useCallback(async () => {
    if (qrRef.current || isRunningRef.current) return;

    const element = document.getElementById("qr-reader");
    if (!element) return;

    const qr = new Html5Qrcode("qr-reader");
    qrRef.current = qr;

    try {
      await qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          if (hasScannedRef.current) return;
          hasScannedRef.current = true;

          onLoading();

          await stopScanner();

          verifyTicket(
            { qrData: decodedText, eventId },
            {
              onSuccess,
              onError: (err) =>
                onError(
                  err?.response?.data?.error?.message || "Verification failed"
                ),
            }
          );
        }
      );

      isRunningRef.current = true;
    } catch (err) {
      toast.error(err.message || "Camera access failed");
    }
  }, [eventId, onError, onLoading, onSuccess, verifyTicket]);

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
      hasScannedRef.current = false;
    };
  }, [startScanner]);

  const scanAgain = async () => {
    hasScannedRef.current = false;
    await stopScanner();
    startScanner();
  };

  return { scanAgain };
};
