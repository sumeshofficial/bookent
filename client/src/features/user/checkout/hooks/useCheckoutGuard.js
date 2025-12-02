import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useCheckoutGuard = () => {
  const navigate = useNavigate();
  //   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lockId = sessionStorage.getItem("lockId");

    console.log(lockId);

    if (!lockId) {
      navigate("/session-expired", { replace: true });
      return;
    }

    // console.log(Date.now() > lockInfo.expiresAt);
    // if (Date.now() > lockInfo.expiresAt) {
    //   console.log("hiii");
    //   sessionStorage.removeItem("lockInfo");
    //   navigate("/session-timeout", { replace: true });
    //   return;
    // }

    // api.get("/checkout/validate-lock", {
    //   params: {
    //     eventId: lockInfo.eventId,
    //     lockId: lockInfo.lockId
    //   }
    // })
    // .then((res) => {
    //   if (!res.data.valid) {
    //     sessionStorage.removeItem("lockInfo");
    //     navigate("/session-timeout", { replace: true });
    //   }
    // })
    // .catch(() => {
    //   navigate("/session-timeout", { replace: true });
    // })
    // .finally(() => setLoading(false));
  }, []);

  //   return { loading };
};
