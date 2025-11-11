import { useEffect } from "react";
import {
  useBeforeUnload,
  useBlocker,
} from "react-router-dom";

const useNavigationGuard = (when) => {
  useBeforeUnload(
    when
      ? (event) => {
          event.preventDefault();
        }
      : null
  );

  const blocker = useBlocker(when);

  useEffect(() => {
    if (blocker.state === "blocked") {
      const proceed = window.confirm(
        "You have unsaved changes. Leave anyway?"
      );
      if (proceed) blocker.proceed();
      else blocker.reset();
    }
  }, [blocker]);
};

export default useNavigationGuard;