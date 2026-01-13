import { useEffect } from "react";
import { useRef } from "react";
import { useSectionLock } from "../features/user/seatSelect/hooks/useSeatLock";

const useReleaseSeatLock = (eventId) => {
  const { releaseSection } = useSectionLock(eventId);

  const firstCleanup = useRef(true);

  useEffect(() => {
    return () => {
      if (firstCleanup.current) {
        firstCleanup.current = false;
        return;
      }

      const lockId = sessionStorage.getItem("lockId");
      if (lockId) {
        releaseSection(lockId);
        sessionStorage.removeItem("lockId");
        sessionStorage.removeItem("appliedCoupon");
      }
    };
  }, [releaseSection]);
};

export default useReleaseSeatLock;
