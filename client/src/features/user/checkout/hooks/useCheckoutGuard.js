import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useCheckoutGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const lockId = sessionStorage.getItem("lockId");

    if (!lockId) {
      navigate("/session-expired", { replace: true });
      return;
    }
  }, [navigate]);
};
