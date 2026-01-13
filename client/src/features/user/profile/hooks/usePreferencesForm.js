import { useForm, useWatch } from "react-hook-form";
import { useMemo, useRef, useState, useEffect } from "react";
import { isEqual } from "lodash";

export const usePreferencesForm = (user) => {
  const defaultValues = useMemo(
    () => ({
      sport: user?.preferences?.sport || "Football",
      venue: user?.preferences?.venue || "Kochi",
      matchTime: user?.preferences?.matchTime || "Afternoon",
      priceRange: user?.preferences?.priceRange || "500 - 2000",
    }),
    [user]
  );

  const [initialPrefs, setInitialPrefs] = useState(defaultValues);

  const initialPrefRef = useRef(defaultValues);

  const form = useForm({
    defaultValues,
  });

  useEffect(() => {
    setInitialPrefs(initialPrefRef.current);
  }, []);

  const { formState, reset, control } = form;
  const watched = useWatch({
    control,
  });

  const isChanged = useMemo(
    () => !isEqual(watched, initialPrefs),
    [watched, initialPrefs]
  );

  const syncInitialPreferences = (newPrefs) => {
    initialPrefRef.current = newPrefs;
    setInitialPrefs(newPrefs);
    reset(newPrefs);
  };

  return { form, isChanged, formState, syncInitialPreferences };
};
