import { useEffect } from "react";
import toast from "react-hot-toast";

const useOfflineTracker = () => {
  useEffect(() => {
    if (!navigator.onLine) {
      toast.error("You're currently offline!");
    }

    const handleOffline = () => {
      toast.dismiss();
      toast.error("You're offline! Please check your internet.", {
        duration: 4000,
      });
    };

    const handleOnline = () => {
      toast.dismiss();
      toast.success("Back online", { duration: 3000 });
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);
};

export default useOfflineTracker;
